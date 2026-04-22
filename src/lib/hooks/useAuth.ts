/**
 * useAuth.ts — 인증 관련 React Query 훅
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * [관심사 분리 규약]
 *
 *   훅(Hook)은 서버 상태 관리(토큰 저장, 캐시 무효화)만 담당합니다.
 *   페이지 이동(navigate)은 훅이 아닌 컴포넌트(LoginPage 등)에서 처리합니다.
 *
 *   이유:
 *     - 훅이 navigate 로직을 포함하면 다른 컨텍스트에서 재사용이 어려움
 *     - React Router의 useNavigate는 Router Provider 안에서만 사용 가능
 *     - 컴포넌트의 mutate() 두 번째 인자로 { onSuccess }를 전달해 처리
 *
 * [토큰 처리]
 *
 *   로그인 성공 시:
 *     - res.data.accessToken → 메모리(writeAccessToken)에 저장
 *     - Refresh Token → 서버가 Set-Cookie(HttpOnly)로 자동 설정, 코드 불필요
 *
 *   로그아웃:
 *     - POST /api/auth/logout → 서버가 Cookie를 삭제하고 DB에서 revoke
 *     - onSettled에서 logout() → 메모리 초기화 + 로그인 페이지 이동
 *
 *   토큰 갱신 (자동):
 *     - axios.ts의 401 interceptor가 /api/auth/refresh를 자동 호출
 *     - 새 accessToken을 메모리에 저장하고 원래 요청을 재시도
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
//
// 훅은 토큰 저장과 캐시 무효화만 담당합니다.
// 로그인 후 페이지 이동은 컴포넌트에서 처리하세요:
//
//   const login = useLogin();
//
//   login.mutate({ email, password }, {
//     onSuccess: (res) => {
//       if (isApiSuccess(res)) navigate(from, { replace: true });
//     },
//   });
// ─────────────────────────────────────────────

export function useLogin() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (body: LoginRequest) =>
      request<ApiResponse<LoginData>>(
        { method: "POST", url: "/api/auth/login", data: body },
        false, // isShowError: false — 에러는 아래 onError에서 토스트 처리
      ),

    ...createApiMutationFeedbackHandlers<LoginData>({
      showToast,
      skipSuccessToast: true,
      fallbackFailureMessage: "로그인에 실패했습니다.",
      /**
       * Access Token → 메모리에 저장
       * Refresh Token → 서버가 HttpOnly Cookie로 자동 설정 (코드 불필요)
       *
       * 페이지 이동은 이 훅에서 하지 않습니다.
       * mutate() 두 번째 인자의 onSuccess 콜백에서 처리하세요.
       */
      onSuccessData: (data) => {
        writeAccessToken(data.accessToken);
        void queryClient.invalidateQueries();
      },
    }),
  });
}

// ─────────────────────────────────────────────
// POST /api/auth/logout
//
// API 호출 → 서버가 Cookie 삭제 + DB revoke
// onSettled → 메모리 초기화 + 로그인 페이지 이동
// ─────────────────────────────────────────────

export function useLogout() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () =>
      request<ApiResponse<null>>(
        { method: "POST", url: "/api/auth/logout" },
        false,
      ),

    ...createApiMutationFeedbackHandlers<null>({
      showToast,
      skipSuccessToast: true,
    }),

    /**
     * [주의] queueMicrotask 사용 금지
     *
     * queueMicrotask 안에서 window.location.replace()를 호출하면
     * React 18의 마이크로태스크 스케줄링과 충돌하여 실행되지 않을 수 있습니다.
     * logout()을 onSettled에서 직접 호출합니다.
     *
     * logout() → clearAccessToken() + window.location.replace('/auth/login')
     * window.location.replace는 브라우저 API이므로 React 상태와 독립적으로 동작합니다.
     */
    onSettled: () => {
      logout();
    },
  });
}

// ─────────────────────────────────────────────
// POST /api/auth/logout-all
//
// 전 디바이스 강제 로그아웃.
// 유효한 Access Token이 필요합니다.
// ─────────────────────────────────────────────

export function useLogoutAll() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () =>
      request<ApiResponse<null>>(
        { method: "POST", url: "/api/auth/logout-all" },
        false,
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
