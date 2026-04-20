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
import { menuListDummy } from "../data/menuListDummy";

const useMenuData = () => {
  const setMenuList = useSetAtom(menuState);
  const accessToken = readAccessToken();
  // 여기서 메뉴 들고오기 contextApi

  const { data: menuData = [] } = useQuery<any>({
    queryKey: [GET_MENU],
    queryFn: () =>
      request<BaseResponse<MenuType[]>>({
        method: "GET",
        url: `/stm-menu/menu`,
      }).then((res) => res.data),
    enabled: !!accessToken,
    placeholderData: menuListDummy,
  });

  useEffect(() => {
    // menuData가 있으면 사용하고, 없으면 menuListDummy 사용
    const dataToUse = menuData && menuData.length > 0 ? menuData : menuListDummy;
    MenuSet(dataToUse);
    if (dataToUse && dataToUse.length > 0) {
      setMenuList(buildMenuTree(dataToUse));
    }
  }, [menuData, setMenuList]);
};

export default useMenuData;
