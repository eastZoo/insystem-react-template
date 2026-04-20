/**
 * useAuth.ts — 인증 관련 React Query 훅
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * [관심사 분리 규약]
 *   훅(Hook)은 서버 상태 관리(토큰 저장, 캐시 무효화)만 담당합니다.
 *   페이지 이동(navigate)은 훅이 아닌 컴포넌트에서 처리합니다.
 *
 * [토큰 처리]
 *   로그인 성공 시: res.data.accessToken → 메모리(writeAccessToken)에 저장
 *   Refresh Token → 서버가 Set-Cookie(HttpOnly)로 자동 설정
 *   토큰 갱신: axios.ts의 401 interceptor가 자동 처리
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";
import { GET_AUTH_ME } from "@/lib/querykeys";
import { getQueryConfig } from "@/lib/constants/queryConfig";
import { useToast } from "@/components/containers/Toast";
import { createApiMutationFeedbackHandlers } from "@/lib/utils/apiMutationFeedback";
import { logout, writeAccessToken } from "@/lib/functions/authFunctions";
import type { ApiResponse } from "@/types/api";
import { isApiSuccess } from "@/types/api";
import type { LoginRequest, LoginData, MeData } from "@/types/domain.types";

// ─────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────

export function useGetMe() {
  return useQuery({
    queryKey: [GET_AUTH_ME],
    queryFn: async () => {
      const res = await request<ApiResponse<MeData>>({
        method: "GET",
        url: "/api/auth/me",
      });
      if (isApiSuccess(res)) return res.data;
      return null;
    },
    ...getQueryConfig("realtime"),
  });
}

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────

export function useLogin() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (body: LoginRequest) =>
      request<ApiResponse<LoginData>>(
        { method: "POST", url: "/api/auth/login", data: body },
        false
      ),

    ...createApiMutationFeedbackHandlers<LoginData>({
      showToast,
      skipSuccessToast: true,
      fallbackFailureMessage: "로그인에 실패했습니다.",
      onSuccessData: (data) => {
        writeAccessToken(data.accessToken);
        void queryClient.invalidateQueries();
      },
    }),
  });
}

// ─────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────

export function useLogout() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () =>
      request<ApiResponse<null>>(
        { method: "POST", url: "/api/auth/logout" },
        false
      ),

    ...createApiMutationFeedbackHandlers<null>({
      showToast,
      skipSuccessToast: true,
    }),

    onSettled: () => {
      logout();
    },
  });
}

// ─────────────────────────────────────────────
// POST /api/auth/logout-all
// ─────────────────────────────────────────────

export function useLogoutAll() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () =>
      request<ApiResponse<null>>(
        { method: "POST", url: "/api/auth/logout-all" },
        false
      ),

    ...createApiMutationFeedbackHandlers<null>({
      showToast,
      skipSuccessToast: true,
    }),

    onSettled: () => {
      logout();
    },
  });
}
