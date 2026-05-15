/**
 * useUserAuth.ts - 사용자 권한관리 React Query 훅
 *
 * 그룹별 사용자 조회, 추가, 삭제, 법인/사업장 조회 API 훅
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/containers/Toast";
import type { ApiSuccessResponse } from "@/types/api";
import { GROUP_AUTH_QUERY_KEYS } from "./useGroupAuth";

// Query Keys
export const USER_AUTH_QUERY_KEYS = {
  groupUsers: (authCd: string) => ["basicinfo", "group", authCd, "users"] as const,
  corpList: ["basicinfo", "corp"] as const,
  bplcList: (coCd?: string) => ["basicinfo", "bplc", coCd || "all"] as const,
  userSearch: (params: SearchUsersParams) =>
    ["basicinfo", "users", "search", params] as const,
};

/** 그룹별 사용자 항목 타입 */
export interface GroupUserItem {
  auth_cd: string;
  reg_id: number;
  id: string;
  nm: string;
  user_type: string;
  co_cd: string | null;
  co_nm: string | null;
  bplc_cd: string | null;
  bplc_nm: string | null;
  emp_no: string | null;
}

/** 법인 항목 타입 */
export interface CorpItem {
  co_cd: string;
  co_nm: string;
  use_yn: string;
}

/** 사업장 항목 타입 */
export interface BplcItem {
  co_cd: string;
  bplc_cd: string;
  bplc_nm: string;
  use_yn: string;
}

/** 사용자 검색 항목 타입 (팝업용) */
export interface UserSearchItem {
  reg_id: number;
  id: string;
  nm: string;
  user_type: string;
  co_cd: string | null;
  co_nm: string | null;
  bplc_cd: string | null;
  bplc_nm: string | null;
  emp_no: string | null;
  emp_nm: string | null;
  current_auth_cd: string | null;
  current_auth_nm: string | null;
}

/** 사용자 검색 파라미터 */
export interface SearchUsersParams {
  keyword?: string;
  coCd?: string;
  bplcCd?: string;
  userType?: string;
  excludeAuthCd?: string;
}

/**
 * 그룹별 사용자 목록 조회 훅
 */
export function useGroupUserList(authCd: string | null) {
  return useQuery({
    queryKey: USER_AUTH_QUERY_KEYS.groupUsers(authCd || ""),
    queryFn: async () => {
      if (!authCd) return [];
      const { data } = await api.get<ApiSuccessResponse<GroupUserItem[]>>(
        `/api/app/basicinfo/group/${authCd}/users`
      );
      return data.data || [];
    },
    enabled: !!authCd,
  });
}

/**
 * 그룹에 사용자 추가 훅
 */
export function useAddGroupUsers() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      authCd,
      regIds,
    }: {
      authCd: string;
      regIds: number[];
    }) => {
      const { data } = await api.post<
        ApiSuccessResponse<{ addedCount: number; movedCount: number }>
      >(`/api/app/basicinfo/group/${authCd}/users/add`, { regIds });
      return data;
    },
    onSuccess: (data, variables) => {
      const result = data.data;
      let message = `사용자 추가 완료 (${result?.addedCount || 0}건)`;
      if (result?.movedCount && result.movedCount > 0) {
        message += ` - ${result.movedCount}건은 다른 그룹에서 이동됨`;
      }
      showToast({ message, type: "success" });
      queryClient.invalidateQueries({
        queryKey: USER_AUTH_QUERY_KEYS.groupUsers(variables.authCd),
      });
      // 다른 그룹 사용자 목록도 갱신
      queryClient.invalidateQueries({
        queryKey: GROUP_AUTH_QUERY_KEYS.groupList,
      });
    },
    onError: () => {
      showToast({ message: "사용자 추가에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 그룹에서 사용자 삭제 훅
 */
export function useRemoveGroupUsers() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      authCd,
      regIds,
    }: {
      authCd: string;
      regIds: number[];
    }) => {
      const { data } = await api.post<ApiSuccessResponse<{ removedCount: number }>>(
        `/api/app/basicinfo/group/${authCd}/users/remove`,
        { regIds }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      const result = data.data;
      showToast({
        message: `사용자 삭제 완료 (${result?.removedCount || 0}건)`,
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: USER_AUTH_QUERY_KEYS.groupUsers(variables.authCd),
      });
    },
    onError: () => {
      showToast({ message: "사용자 삭제에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 법인 목록 조회 훅
 */
export function useCorpList() {
  return useQuery({
    queryKey: USER_AUTH_QUERY_KEYS.corpList,
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<CorpItem[]>>(
        "/api/app/basicinfo/corp"
      );
      return data.data || [];
    },
  });
}

/**
 * 사업장 목록 조회 훅
 */
export function useBplcList(coCd?: string) {
  return useQuery({
    queryKey: USER_AUTH_QUERY_KEYS.bplcList(coCd),
    queryFn: async () => {
      const params = coCd ? `?coCd=${coCd}` : "";
      const { data } = await api.get<ApiSuccessResponse<BplcItem[]>>(
        `/api/app/basicinfo/bplc${params}`
      );
      return data.data || [];
    },
  });
}

/**
 * 사용자 검색 훅 (팝업용)
 */
export function useSearchUsers(params: SearchUsersParams, enabled = false) {
  return useQuery({
    queryKey: USER_AUTH_QUERY_KEYS.userSearch(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append("keyword", params.keyword);
      if (params.coCd) queryParams.append("coCd", params.coCd);
      if (params.bplcCd) queryParams.append("bplcCd", params.bplcCd);
      if (params.userType) queryParams.append("userType", params.userType);
      if (params.excludeAuthCd) queryParams.append("excludeAuthCd", params.excludeAuthCd);

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/app/basicinfo/users/search?${queryString}`
        : "/api/app/basicinfo/users/search";

      const { data } = await api.get<ApiSuccessResponse<UserSearchItem[]>>(url);
      return data.data || [];
    },
    enabled,
  });
}

/**
 * 사용자 검색 뮤테이션 훅 (수동 검색용)
 */
export function useSearchUsersMutation() {
  return useMutation({
    mutationFn: async (params: SearchUsersParams) => {
      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append("keyword", params.keyword);
      if (params.coCd) queryParams.append("coCd", params.coCd);
      if (params.bplcCd) queryParams.append("bplcCd", params.bplcCd);
      if (params.userType) queryParams.append("userType", params.userType);
      if (params.excludeAuthCd) queryParams.append("excludeAuthCd", params.excludeAuthCd);

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/app/basicinfo/users/search?${queryString}`
        : "/api/app/basicinfo/users/search";

      const { data } = await api.get<ApiSuccessResponse<UserSearchItem[]>>(url);
      return data.data || [];
    },
  });
}
