/**
 * axios.ts — API 클라이언트 설정 (base template 패턴)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * [토큰 처리 전략]
 *
 *   withCredentials: true
 *     HttpOnly Cookie(Refresh Token)를 API 요청에 자동으로 포함시킵니다.
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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── Request Interceptor ───────────────────────────────────────────────────────

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const url = String(originalRequest?.url ?? "");
    const isAuthPath =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/refresh") ||
      url.includes("/api/auth/logout");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthPath
    ) {
      originalRequest._retry = true;

      try {
        const base = import.meta.env.VITE_API_BASE_URL;
        const { data: body } = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${base}/api/auth/refresh`,
          undefined,
          { withCredentials: true }
        );

        if (!body.success || !body.data) {
          await showAlert(
            body.success === false ? body.message : "토큰 갱신에 실패했습니다."
          );
          return logout();
        }

        writeAccessToken(body.data.accessToken);
        void queryClient.invalidateQueries({ queryKey: [GET_AUTH_ME] });
        return api(originalRequest);
      } catch {
        await showAlert("세션이 만료되었습니다. 다시 로그인해주세요.");
        return logout();
      }
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
