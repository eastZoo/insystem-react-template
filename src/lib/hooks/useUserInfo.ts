/**
 * useUserInfo.ts — 로그인 사용자 정보 조회 훅
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * GET /api/permission/me 를 호출하여 사용자 기본 정보를 받아옵니다.
 *
 * - userName: sya_user.nm (사용자명)
 * - userRole: sya_auth.auth_nm (권한명)
 * - userTeam: bs_dept.dept_nm (부서명)
 *
 * 사이드바 푸터에 사용자 정보를 표시하는 데 사용됩니다.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import { GET_USER_INFO } from "@/lib/querykeys";
import { getQueryConfig } from "@/lib/constants/queryConfig";
import { isApiSuccess } from "@/types/api";
import type { ApiResponse } from "@/types/api";
import type { UserInfo } from "@/types/domain.types";
import { readAccessToken } from "@/lib/functions/authFunctions";

/**
 * 로그인 사용자의 기본 정보를 조회합니다.
 *
 * @param options.enabled 외부에서 호출 여부를 제어하고 싶을 때 사용 (기본: 토큰 존재 여부로 자동 판단)
 */
export function useUserInfo(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? Boolean(readAccessToken());

  return useQuery({
    queryKey: [GET_USER_INFO],
    queryFn: async (): Promise<UserInfo | null> => {
      const res = await request<ApiResponse<UserInfo>>({
        method: "GET",
        url: "/api/permission/me",
      });
      if (isApiSuccess(res)) return res.data ?? null;
      return null;
    },
    enabled,
    ...getQueryConfig("settings"),
  });
}
