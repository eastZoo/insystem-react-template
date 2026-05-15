/**
 * useMenu.ts - 메뉴 관리 React Query 훅
 *
 * 메뉴 조회, 저장 API 훅
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/containers/Toast";
import type { ApiSuccessResponse } from "@/types/api";

// Query Keys
export const MENU_QUERY_KEYS = {
  menuList: ["basicinfo", "menu"] as const,
  menuDetail: (menuCd: string) => ["basicinfo", "menu", menuCd] as const,
};

/** 메뉴 항목 타입 */
export interface MenuItem {
  menu_cd: string;
  menu_nm: string;
  up_menu_cd: string | null;
  up_menu_nm?: string;
  url: string | null;
  icon: string | null;
  sort: number;
  use_yn: string;
  rmk: string | null;
  // 클라이언트 전용 플래그
  _isNew?: boolean;
  _isDeleted?: boolean;
  _isModified?: boolean;
}

/** 트리 구조용 메뉴 항목 */
export interface MenuTreeItem extends MenuItem {
  /** ag-grid 트리 구조를 위한 경로 배열 */
  hierarchy: string[];
  /** 하위 메뉴 개수 */
  childCount?: number;
  /** 메뉴 깊이 (들여쓰기용) */
  depth: number;
  /** rowGrouping용 상위 메뉴 경로 (1단계: 상위메뉴명, 2단계: 상위>중위 등) */
  groupPath: string | null;
  /** 최상위 메뉴 여부 */
  isTopLevel: boolean;
}

/**
 * 메뉴 목록 조회 훅
 */
export function useMenuList() {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.menuList,
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<MenuItem[]>>(
        "/api/app/basicinfo/menu"
      );
      return data.data || [];
    },
  });
}

/**
 * 메뉴 목록을 트리 구조로 변환
 * ag-grid의 rowGrouping을 위한 hierarchy 배열 추가
 * 트리 순서(DFS)로 정렬하여 반환
 */
export function buildMenuHierarchy(menuList: MenuItem[]): MenuTreeItem[] {
  // 메뉴 코드별 인덱스 맵 생성
  const menuMap = new Map<string, MenuItem>();
  menuList.forEach((menu) => {
    menuMap.set(menu.menu_cd, menu);
  });

  // 각 메뉴의 계층 경로 계산
  const getHierarchy = (menu: MenuItem): string[] => {
    const path: string[] = [];
    let current: MenuItem | undefined = menu;

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

  // rowGrouping용 그룹 경로 계산 (상위 메뉴명 경로)
  const getGroupPath = (menu: MenuItem): string | null => {
    if (!menu.up_menu_cd || menu.up_menu_cd === "0") {
      return null; // 최상위 메뉴는 그룹 없음
    }
    // 상위 메뉴 경로 구성 (조상 메뉴들의 이름)
    const path: string[] = [];
    let current = menuMap.get(menu.up_menu_cd);
    while (current) {
      path.unshift(current.menu_nm);
      if (current.up_menu_cd && current.up_menu_cd !== "0") {
        current = menuMap.get(current.up_menu_cd);
      } else {
        break;
      }
    }
    return path.join(" > ");
  };

  // 트리 순서로 정렬 (DFS 방식)
  const sortedList: MenuTreeItem[] = [];
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
        groupPath: getGroupPath(menu),
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
 * 메뉴 단일 조회 훅
 */
export function useMenuDetail(menuCd: string | null) {
  return useQuery({
    queryKey: MENU_QUERY_KEYS.menuDetail(menuCd || ""),
    queryFn: async () => {
      if (!menuCd) return null;
      const { data } = await api.get<ApiSuccessResponse<MenuItem>>(
        `/api/app/basicinfo/menu/${menuCd}`
      );
      return data.data || null;
    },
    enabled: !!menuCd,
  });
}

/**
 * 메뉴 일괄 저장 훅
 */
export function useSaveMenu() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: MenuItem[]) => {
      const { data } = await api.post<
        ApiSuccessResponse<{ savedCount: number; deletedCount: number }>
      >("/api/app/basicinfo/menu/save", { items });
      return data;
    },
    onSuccess: (data) => {
      const result = data.data;
      showToast({
        message: `저장 완료 (저장: ${result?.savedCount || 0}건, 삭제: ${result?.deletedCount || 0}건)`,
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: MENU_QUERY_KEYS.menuList,
      });
    },
    onError: () => {
      showToast({ message: "메뉴 저장에 실패했습니다.", type: "error" });
    },
  });
}
