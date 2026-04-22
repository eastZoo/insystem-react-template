/**
 * axios.ts — API 클라이언트 설정
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * [토큰 처리 전략]
 *
 *   withCredentials: true
 *     HttpOnly Cookie(Refresh Token)를 API 요청에 자동으로 포함시킵니다.
 *     CORS 환경에서는 서버의 Access-Control-Allow-Credentials: true 설정도 필요합니다.
 *
 *   Request Interceptor
 *     메모리에 저장된 Access Token을 Authorization: Bearer 헤더에 자동 추가합니다.
 *
 *   Response Interceptor (401 자동 갱신)
 *     1. 401 응답 수신 (Access Token 만료)
 *     2. POST /api/auth/refresh 호출 (body 없음, Cookie 자동 전송)
 *     3. 새 Access Token을 메모리에 저장
 *     4. 실패했던 원래 요청을 새 토큰으로 재시도
 *     5. /refresh도 실패하면 → 로그아웃 처리
 *
 *   [동시 401 응답 처리]
 *     여러 요청이 동시에 401을 받으면 첫 번째 refresh만 실행하고,
 *     나머지 요청은 그 결과를 대기합니다.
 *     이로써 Refresh Token Rotation으로 인한 레이스 컨디션을 방지합니다.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { ApiError } from "@/types/apiError";
import type { ApiResponse } from "@/types/api";
import { isApiFailBody } from "@/lib/utils/apiErrorHandler";
import {
  logout,
  readAccessToken,
  writeAccessToken,
} from "./functions/authFunctions";
import { queryClient } from "./queryClient";
import { GET_AUTH_ME } from "./querykeys";
import { showAlert } from "@/components/containers/Alert";

/**
 * 토큰 갱신 진행 중인 Promise.
 * 여러 요청이 동시에 401을 받을 때 첫 번째 refresh만 실행하고 나머지는 대기.
 */
let _refreshPromise: Promise<string | null> | null = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  /**
   * withCredentials: true
   * HttpOnly Cookie(Refresh Token)를 cross-origin 요청에도 포함시킵니다.
   * 서버의 CORS 설정에서 credentials: true 가 함께 설정되어 있어야 합니다.
   */
  withCredentials: true,
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// 모든 요청에 Access Token을 Authorization 헤더로 자동 주입합니다.

api.interceptors.request.use(
  async (config) => {
    const accessToken = readAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor (401 자동 갱신) ─────────────────────────────────────
// Access Token이 만료되면 Refresh Token Cookie로 자동 갱신 후 재시도합니다.
// 여러 요청이 동시에 401을 받으면 첫 번째 refresh만 실행하고 나머지는 대기합니다.

/**
 * 토큰 갱신 실행 — 실제 POST /api/auth/refresh 호출
 * 이 함수는 직접 호출하지 않고 refreshTokenWithLock()을 통해 호출됩니다.
 */
const executeRefresh = async (): Promise<string | null> => {
  try {
    const base = import.meta.env.VITE_API_BASE_URL;
    const { data: body } = await axios.post<ApiResponse<{ accessToken: string }>>(
      `${base}/api/auth/refresh`,
      undefined,
      { withCredentials: true }
    );

    if (!body.success || !body.data) {
      return null;
    }

    writeAccessToken(body.data.accessToken);
    void queryClient.invalidateQueries({ queryKey: [GET_AUTH_ME] });
    return body.data.accessToken;
  } catch {
    return null;
  }
};

/**
 * 토큰 갱신 (잠금 포함) — 동시 요청 시 첫 번째만 실행
 *
 * [동작 방식]
 *   1. 첫 번째 호출: 실제 refresh API 호출
 *   2. 두 번째+ 호출: 첫 번째 요청 결과를 대기
 *   3. 모든 대기 요청이 같은 새 토큰을 받음
 */
const refreshTokenWithLock = async (): Promise<string | null> => {
  // 이미 진행 중인 refresh가 있으면 대기
  if (_refreshPromise) {
    return _refreshPromise;
  }

  // 새 refresh 시작
  _refreshPromise = executeRefresh();

  try {
    return await _refreshPromise;
  } finally {
    // refresh 완료 후 Promise 초기화
    _refreshPromise = null;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const url = String(originalRequest?.url ?? "");
    // 인증 관련 엔드포인트에서 발생한 401은 재시도하지 않습니다.
    // (무한 루프 방지)
    const isAuthPath =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/refresh") ||
      url.includes("/api/auth/logout") ||
      url.includes("/api/auth/session");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthPath
    ) {
      originalRequest._retry = true;

      // 잠금이 있는 토큰 갱신 — 동시 401 대응
      const newToken = await refreshTokenWithLock();

      if (!newToken) {
        await showAlert("세션이 만료되었습니다. 다시 로그인해주세요.");
        return logout();
      }

      // 새 토큰으로 원래 요청 재시도
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

/**
 * @param config - axios request config
 * @param isShowError - 에러 발생 시 alert 띄울지 여부
 */
const request = async <T>(
  config: AxiosRequestConfig,
  isShowError: boolean = true
): Promise<T> => {
  const { method } = config;
  const isGetRequest = method?.toUpperCase() === "GET";

  try {
    const { data } = await api.request<T>({ ...config });

    if (!isGetRequest && (data as { success?: boolean })?.success === false) {
      throw new ApiError({
        message:
          typeof (data as { message?: string }).message === "string"
            ? (data as { message: string }).message
            : "서버 요청에 실패했습니다.",
      });
    }

    return data;
  } catch (error) {
    let message = "서버요청 에러!";

    if (error instanceof AxiosError) {
      const responseData = error.response?.data;
      if (isApiFailBody(responseData)) {
        message = responseData.message;
      } else if (responseData && typeof responseData === "object") {
        const raw = (responseData as { message?: unknown }).message;
        if (typeof raw === "string") message = raw;
        else if (Array.isArray(raw))
          message = raw.filter((m) => typeof m === "string").join(", ");
      }

      if (isGetRequest) {
        if (error?.response?.status === 403) {
          showAlert("조회 권한이 없습니다");
        }
        return [] as T;
      }
    } else if (error instanceof ApiError) {
      message = error.message;
    }

    if (isShowError && !isGetRequest) {
      showAlert(message);
    }

    throw error;
  }
};

const setUserIp = (ip: string) => {
  api.defaults.headers.common["ip"] = ip;
};

export { api, request, setUserIp };
