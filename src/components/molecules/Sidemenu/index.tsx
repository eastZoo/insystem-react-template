import * as S from "./Sidemenu.style";
import type { MenuItem, MenuType } from "@/types/menu";
import { useMemo } from "react";
import { SidemenuTop } from "../../atoms/SidemenuTop";
import SidemenuList from "../SidemenuList";
import { SidemenuFooter } from "../../atoms/SidemenuFooter";
import { menuListDummy } from "@/lib/data/menuListDummy";
import { permissionDummy } from "@/lib/data/permissionDummy";
import { buildMenuTree } from "@/lib/utils/buildMenuTree";

interface SidemenuProps {
  asideToggle?: any;
  onContextMenu: (event: React.MouseEvent, target: any) => void;
}

export const Sidemenu = ({ asideToggle, onContextMenu }: SidemenuProps) => {
  const filterMenuByPermission = (menuList: any[]): MenuItem[] => {
    const hasPermission = (title: string) => {
      const permission = permissionDummy.find((p) => p.pmsMenuName === title);
      return permission ? permission.pmsMenuActive === 1 : 0;
    };

    const filterSubmenu = (submenu: MenuItem[]): MenuItem[] => {
      return submenu
        .map((item) => ({
          ...item,
          submenu: item.submenu ? filterSubmenu(item.submenu) : undefined,
        }))
        .filter((item) => hasPermission(item.title));
    };

    return filterSubmenu(menuList);
  };

  const menuTree = useMemo(
    () => filterMenuByPermission(buildMenuTree([...menuListDummy])),
    []
  );

  return (
    <S.SidemenuSection>
      <SidemenuTop asideToggle={asideToggle} />
      <SidemenuList menuList={menuTree} onContextMenu={onContextMenu} />
      <SidemenuFooter />
    </S.SidemenuSection>
  );
};
