import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { ApiError } from "@/types/apiError";
import {
  logout,
  readAccessToken,
  readRefreshToken,
  writeAccessToken,
  writeRefreshToken,
} from "./functions/authFunctions";
import { showAlert } from "@/components/containers/Alert";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const jwtToken = readAccessToken();
      const refreshToken = readRefreshToken();
      if (!refreshToken) {
        await showAlert("로그인해주세요");
        return logout();
      }
      try {
        const response = await axios.post(
          `${process.env.VITE_API_BASE_URL}/stm-user/refresh-token`,
          {
            jwtToken,
            refreshToken,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const accessTokenData = response?.data?.accessToken;
        const refreshTokenData = response?.data?.refreshToken;
        writeAccessToken(accessTokenData);
        writeRefreshToken(refreshTokenData);

        return api(originalRequest);
      } catch (e) {
        await showAlert("토큰이 만료되었습니다. 다시 로그인해주세요");
        return logout();
      }
    }

    return Promise.reject(error);
  }
);

/**
 * @param config - axios request config
 * @param isShowError - 에러 발생시 alert 띄울지 여부
 * @returns
 */
const request = async <T>(
  config: AxiosRequestConfig,
  isShowError: boolean = true
): Promise<T> => {
  const { method } = config;
  const isGetRequest = method?.toUpperCase() === "GET";

  try {
    const { data } = await api.request<T>({ ...config });

    if (!isGetRequest && (data as any)?.success === false) {
      throw new ApiError({
        message: (data as any)?.message ?? "서버요청 에러!",
      });
    }

    return data;
  } catch (error) {
    let message = "서버요청 에러!";

    if (error instanceof AxiosError) {
      const { response }: any = error;
      if (response?.data?.message) {
        message = response.data.message;
      }

      if (isGetRequest) {
        if (error?.response?.status === 403) {
          showAlert("조회 권한이 없습니다");
        }
        return [] as any;
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

export { request, setUserIp };
