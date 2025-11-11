import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  logout,
  readAccessToken,
  readRefreshToken,
  writeAccessToken,
  writeRefreshToken,
} from "./functions/authFunctions";

// _retry 속성을 추가한 확장 타입
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
// Axios 인스턴스 생성 및 기본 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 모든 요청에 Access Token 포함
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

// 응답 인터셉터: Access Token 만료 시 자동 갱신 및 재요청
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // 401 에러(Unauthorized)이고, 재시도한 적이 없는 경우
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 재시도 플래그 설정

      const refreshToken = readRefreshToken();

      // Refresh Token이 없는 경우, 로그인 페이지로 리디렉션
      if (!refreshToken) {
        logout();
        // 에러를 던져 호출자에게 알림
        return Promise.reject(new Error("로그인이 필요합니다."));
      }

      try {
        // 토큰 갱신 요청
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;
        writeAccessToken(accessToken);
        writeRefreshToken(newRefreshToken);

        // Access Token을 갱신하고, 기존 요청을 다시 수행
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (e) {
        // 토큰 갱신 실패 시, 로그아웃 처리
        logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error); // 401 외 다른 에러는 그대로 반환
  }
);

/**
 * API 요청을 수행하는 함수
 * @param config - Axios 요청 설정
 * @returns 응답 데이터
 * @description
 * 이 함수는 API 요청에 집중하며, 에러 발생 시 에러를 던집니다.
 * 에러 처리는 이 함수를 호출하는 컴포넌트 또는 서비스 레이어에서 담당합니다.
 */
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const { data } = await api.request<T>(config);
    return data;
  } catch (error) {
    // API 에러를 그대로 다시 던져 호출자가 catch 블록에서 처리할 수 있도록 함
    console.log("API 요청 중 에러 발생:", error);
    throw error;
  }
};

export { request };
