import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconArrow from "@/styles/assets/svg/icon_sidemenu_arrow.svg?react";

import * as S from "./SidemenuItem.style";
import SidemenuList from "../../organisms/SidemenuList";
import { useSelectedMenu } from "@/store/menu";

import IconMenu01 from "@/styles/assets/svg/icon_menu_01.svg?react";
import { MenuIcon } from "./SidemenuItem.style";

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  IconMenu01,

};

interface SidemenuItemProps {
  data: any;
  onContextMenu: (event: React.MouseEvent, target: any) => void;
}

export const SidemenuItem = ({ data, onContextMenu }: SidemenuItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submenu, setSubmenu] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedMenu, setMenu] = useSelectedMenu();

  // buildMenuTree에서 id: item.oid로 변환되므로 data.id 사용
  const menuId = data.id ?? data.oid;
  const isMatch = menuId === selectedMenu;

  useEffect(() => {
    if (!initialized) {
      const openMenu = (menu: any, path: string) => {
        if (!menu.submenu) return false;
        for (const subItem of menu.submenu) {
          if (path.startsWith(subItem.path)) {
            return true;
          }
          if (subItem.submenu && openMenu(subItem, path)) {
            return true;
          }
        }
        return false;
      };
      if (openMenu(data, location.pathname)) {
        setSubmenu(true);
      }

      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, data]);

  const submenuToggle = () => {
    console.log("submenuToggle");
    setSubmenu(!submenu);
  };

  return (
    <S.SidemenuItemBox
      $submenuToggle={submenu}
      $menuActive={isMatch}
      onContextMenu={(e) => onContextMenu(e, data.path)}
    >
      {data.submenu ? (
        <>
          <S.SidemenuListItem
            $depth={data.depth}
            onClick={data.submenu && submenuToggle}
          >
            <S.SidemenuItemTit>
              {data.icon && <MenuIcon><IconMenu01 /></MenuIcon>}
              <S.TitBox>{data.title}</S.TitBox>
            </S.SidemenuItemTit>
            {data.submenu && <IconArrow />}
          </S.SidemenuListItem>
          <SidemenuList
            depth={data.depth + 1}
            menuList={data.submenu}
            onContextMenu={onContextMenu}
          />
        </>
      ) : (
        // <Link to={`${data.path}`}>
        <S.SidemenuListItem
          key={data.path}
          $depth={data.depth}
          onClick={() => {
            setMenu({ id: menuId });
            if (data.path) {
              navigate(data.path);
            }
          }}
        >
          <S.SidemenuItemTit>
            {data.icon && <MenuIcon><IconMenu01 /></MenuIcon>}
            <S.TitBox>{data.title}</S.TitBox>
          </S.SidemenuItemTit>
          {data.submenu && <IconArrow />}
        </S.SidemenuListItem>
      )}
    </S.SidemenuItemBox>
  );
};
