import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { ReactComponent as IconSidemenuArrow } from "@/styles/assets/svg/icon_sidemenu_arrow.svg";
import * as S from "./SidemenuItem.style";
import SidemenuList from "../../molecules/SidemenuList";
import { useSelectedMenu } from "@/store/menu";

interface SidemenuItemProps {
  data: any;
  onContextMenu: (event: React.MouseEvent, target: any) => void;
}

export const SidemenuItem = ({ data, onContextMenu }: SidemenuItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submenu, setSubmenu] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedMenuId, setMenu] = useSelectedMenu();

  const isMatch = () => {
    if (selectedMenuId && data.oid === selectedMenuId) {
      return true;
    }
    if (location.pathname === data.path) {
      return true;
    }
    if (!data.submenu) {
      return location.pathname === data.path;
    }
    return false;
  };

  const isActive = isMatch();

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
  }, [location.pathname, data]);

  const submenuToggle = () => {
    setSubmenu(!submenu);
  };

  const handleMenuClick = () => {
    if (data.path) {
      navigate(data.path);
      setMenu({ id: data.oid });
    }
  };

  const handleSubmenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    submenuToggle();
    if (data.allowNavigation && data.path) {
      handleMenuClick();
    }
  };

  return (
    <S.SidemenuItemBox
      $submenuToggle={submenu}
      $menuActive={isActive}
      onContextMenu={(e) => onContextMenu(e, data.path)}
    >
      {data.submenu ? (
        <>
          <S.SidemenuListItem
            $depth={data.depth}
            $menuActive={isActive}
            onClick={handleSubmenuClick}
          >
            <S.SidemenuItemTit>
              {data.depth !== 1 && <S.BulletPoint>•</S.BulletPoint>}
              <S.TitBox>{data.title}</S.TitBox>
            </S.SidemenuItemTit>
            {data.depth === 1 && data.submenu && (
              <S.ArrowIcon $open={submenu} aria-hidden>
                ▼
              </S.ArrowIcon>
            )}
          </S.SidemenuListItem>
          <SidemenuList
            depth={data.depth + 1}
            menuList={data.submenu}
            onContextMenu={onContextMenu}
          />
        </>
      ) : (
        <S.SidemenuListItem
          key={data.path}
          $depth={data.depth}
          $menuActive={isActive}
          onClick={handleMenuClick}
        >
          <S.SidemenuItemTit>
            {/* {data.depth === 1 && data.icon} */}
            {data.depth !== 1 && <S.BulletPoint>•</S.BulletPoint>}
            <S.TitBox>{data.title}</S.TitBox>
          </S.SidemenuItemTit>
          {/* {data.submenu && <IconArrow />} */}
        </S.SidemenuListItem>
      )}
    </S.SidemenuItemBox>
  );
};
