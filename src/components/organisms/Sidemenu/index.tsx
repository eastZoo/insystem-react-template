import * as S from "./Sidemenu.style";
// import { menuList } from "../../../data/menu";
import { useAtomValue } from "jotai";
import { menuState } from "@/store/menu";
import type { MenuItem, MenuType } from "@/types/menu";
import type { Permission } from "@/types/permission";
import { SidemenuTop } from "../../atoms/SidemenuTop";
import SidemenuList from "../SidemenuList";
import { menuListDummy } from "@/lib/data/menuListDummy";
import { permissionDummy } from "@/lib/data/permissionDummy";

interface SidemenuProps {
  asideToggle?: any;
  permissions: Permission[];
  onContextMenu: (event: React.MouseEvent, target: any) => void;
}

export const Sidemenu = ({
  asideToggle,
  permissions,
  onContextMenu,
}: SidemenuProps) => {
  const menuList = useAtomValue(menuState);

  const filterMenuByPermission = (
    menuList: any[],
    permissions: Permission[]
  ): MenuItem[] => {
    const hasPermission = (title: string) => {
      const permission = permissions.find((p) => p.pmsMenuName === title);
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

  return (
    <S.SidemenuSection>
      <SidemenuTop asideToggle={asideToggle} />
      <SidemenuList
        menuList={filterMenuByPermission(menuListDummy, permissionDummy as any)}
        onContextMenu={onContextMenu}
      />
    </S.SidemenuSection>
  );
};
