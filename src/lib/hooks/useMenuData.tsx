import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { menuState, MenuSet } from "@/store/menu";
import { request } from "@/lib/api";
import { GET_MENU } from "@/lib/querykeys";
import type { BaseResponse } from "@/types/baseRespones";
import type { MenuType } from "@/types/menu";
import { buildMenuTree } from "@/lib/utils/buildMenuTree";
import { readAccessToken } from "@/lib/functions/authFunctions";

/**
 * 사용자 메뉴 데이터를 API로부터 가져오고 상태를 관리하는 훅
 *
 * - JWT 토큰의 roleId를 기반으로 사용자 권한에 맞는 메뉴 조회
 * - 메뉴 데이터를 트리 구조로 변환하여 menuState에 저장
 */
const useMenuData = () => {
  const setMenuList = useSetAtom(menuState);
  const accessToken = readAccessToken();

  const { data: menuData = [], isLoading, isError } = useQuery<MenuType[]>({
    queryKey: [GET_MENU],
    queryFn: async () => {
      const res = await request<BaseResponse<MenuType[]>>({
        method: "GET",
        url: `/api/stm-menu/menu`,
      });
      return res.data ?? [];
    },
    enabled: !!accessToken,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
    retry: 3,
  });

  useEffect(() => {
    if (menuData.length > 0) {
      // 전역 M 변수에 평탄화된 메뉴 저장 (탭 관리용)
      MenuSet(menuData);
      // 트리 구조로 변환하여 menuState에 저장 (사이드바 렌더링용)
      setMenuList(buildMenuTree(menuData));
    }
  }, [menuData, setMenuList]);

  return { menuData, isLoading, isError };
};

export default useMenuData;
