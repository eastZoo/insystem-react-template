/**
 * useGroupAuth.ts - 그룹권한 관리 React Query 훅
 *
 * 그룹 조회, 저장, 메뉴 권한 API 훅
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/containers/Toast";
import type { ApiSuccessResponse } from "@/types/api";

// Query Keys
export const GROUP_AUTH_QUERY_KEYS = {
  groupList: ["basicinfo", "group"] as const,
  groupDetail: (authCd: string) => ["basicinfo", "group", authCd] as const,
  groupMenus: (authCd: string) => ["basicinfo", "group", authCd, "menus"] as const,
};

/** 그룹 항목 타입 */
export interface GroupItem {
  auth_cd: string;
  auth_nm: string;
  user_type_cd: string | null;
  use_yn: string;
  // 클라이언트 전용 플래그
  _isNew?: boolean;
  _isDeleted?: boolean;
  _isModified?: boolean;
}

/** 그룹별 메뉴 권한 항목 타입 */
export interface GroupMenuAuthItem {
  auth_cd: string;
  menu_cd: string;
  menu_nm: string;
  up_menu_cd: string | null;
  up_menu_nm: string;
  sort: number;
  sel_auth_yn: string;
  save_auth_yn: string;
}

/** 트리 구조용 메뉴 권한 항목 */
export interface MenuAuthTreeItem extends GroupMenuAuthItem {
  /** ag-grid 트리 구조를 위한 경로 배열 */
  hierarchy: string[];
  /** 하위 메뉴 개수 */
  childCount?: number;
  /** 메뉴 깊이 (들여쓰기용) */
  depth: number;
  /** 최상위 메뉴 여부 */
  isTopLevel: boolean;
  // 클라이언트 전용 플래그
  _isModified?: boolean;
}

/**
 * 그룹 목록 조회 훅
 */
export function useGroupList() {
  return useQuery({
    queryKey: GROUP_AUTH_QUERY_KEYS.groupList,
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<GroupItem[]>>(
        "/api/app/basicinfo/group"
      );
      return data.data || [];
    },
  });
}

/**
 * 그룹 단일 조회 훅
 */
export function useGroupDetail(authCd: string | null) {
  return useQuery({
    queryKey: GROUP_AUTH_QUERY_KEYS.groupDetail(authCd || ""),
    queryFn: async () => {
      if (!authCd) return null;
      const { data } = await api.get<ApiSuccessResponse<GroupItem>>(
        `/api/app/basicinfo/group/${authCd}`
      );
      return data.data || null;
    },
    enabled: !!authCd,
  });
}

/**
 * 그룹 일괄 저장 훅
 */
export function useSaveGroup() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: GroupItem[]) => {
      const { data } = await api.post<
        ApiSuccessResponse<{ savedCount: number; deletedCount: number }>
      >("/api/app/basicinfo/group/save", { items });
      return data;
    },
    onSuccess: (data) => {
      const result = data.data;
      showToast({
        message: `저장 완료 (저장: ${result?.savedCount || 0}건, 삭제: ${result?.deletedCount || 0}건)`,
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: GROUP_AUTH_QUERY_KEYS.groupList,
      });
    },
    onError: () => {
      showToast({ message: "그룹 저장에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 그룹별 메뉴 권한 목록 조회 훅
 */
export function useGroupMenuAuthList(authCd: string | null) {
  return useQuery({
    queryKey: GROUP_AUTH_QUERY_KEYS.groupMenus(authCd || ""),
    queryFn: async () => {
      if (!authCd) return [];
      const { data } = await api.get<ApiSuccessResponse<GroupMenuAuthItem[]>>(
        `/api/app/basicinfo/group/${authCd}/menus`
      );
      return data.data || [];
    },
    enabled: !!authCd,
  });
}

/**
 * 메뉴 권한 목록을 트리 구조로 변환
 * DFS 방식으로 정렬하여 반환
 */
export function buildMenuAuthHierarchy(menuList: GroupMenuAuthItem[]): MenuAuthTreeItem[] {
  // 메뉴 코드별 인덱스 맵 생성
  const menuMap = new Map<string, GroupMenuAuthItem>();
  menuList.forEach((menu) => {
    menuMap.set(menu.menu_cd, menu);
  });

  // 각 메뉴의 계층 경로 계산
  const getHierarchy = (menu: GroupMenuAuthItem): string[] => {
    const path: string[] = [];
    let current: GroupMenuAuthItem | undefined = menu;

    while (current) {
      path.unshift(current.menu_nm);
      if (current.up_menu_cd && current.up_menu_cd !== "0") {
        current = menuMap.get(current.up_menu_cd);
      } else {
        break;
      }
    }

    return path;
  };

  // 하위 메뉴 개수 계산
  const getChildCount = (menuCd: string): number => {
    return menuList.filter((m) => m.up_menu_cd === menuCd).length;
  };

  // 트리 순서로 정렬 (DFS 방식)
  const sortedList: MenuAuthTreeItem[] = [];
  const visited = new Set<string>();

  const traverse = (parentCd: string | null) => {
    const children = menuList
      .filter((m) => {
        const upCd = m.up_menu_cd;
        if (parentCd === null) {
          return !upCd || upCd === "0";
        }
        return upCd === parentCd;
      })
      .sort((a, b) => a.sort - b.sort);

    for (const menu of children) {
      if (visited.has(menu.menu_cd)) continue;
      visited.add(menu.menu_cd);

      const hierarchy = getHierarchy(menu);
      const isTopLevel = !menu.up_menu_cd || menu.up_menu_cd === "0";

      sortedList.push({
        ...menu,
        hierarchy,
        childCount: getChildCount(menu.menu_cd),
        depth: hierarchy.length,
        isTopLevel,
      });

      // 하위 메뉴 재귀 처리
      traverse(menu.menu_cd);
    }
  };

  traverse(null);

  return sortedList;
}

/**
 * 그룹별 메뉴 권한 저장 훅
 */
export function useSaveGroupMenuAuth() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      authCd,
      items,
    }: {
      authCd: string;
      items: Array<{ menu_cd: string; sel_auth_yn: string; save_auth_yn: string }>;
    }) => {
      const { data } = await api.post<ApiSuccessResponse<{ savedCount: number }>>(
        `/api/app/basicinfo/group/${authCd}/menus/save`,
        { items }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      const result = data.data;
      showToast({
        message: `메뉴 권한 저장 완료 (${result?.savedCount || 0}건)`,
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: GROUP_AUTH_QUERY_KEYS.groupMenus(variables.authCd),
      });
    },
    onError: () => {
      showToast({ message: "메뉴 권한 저장에 실패했습니다.", type: "error" });
    },
  });
}
