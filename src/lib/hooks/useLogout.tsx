import { useLogout as useLogoutMutation } from "@/hooks/useAuth";
import { logout as authLogout, isMockAuth } from "@/lib/functions/authFunctions";

/**
 * 로그아웃 함수를 반환합니다.
 *
 * - 실제 모드: POST /api/auth/logout → 완료 후 즉시 로컬 정리 + 페이지 이동
 * - Mock 모드: API 호출 없이 즉시 로컬 정리
 */
export const useLogout = () => {
  const logoutMutation = useLogoutMutation();

  const logout = async () => {
    if (isMockAuth()) {
      authLogout();
      return;
    }

    try {
      await logoutMutation.mutateAsync();
    } catch {
      // API 실패해도 로컬 정리는 반드시 실행
    } finally {
      authLogout();
    }
  };

  return logout;
};
