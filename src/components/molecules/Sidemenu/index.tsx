import * as S from "./Sidemenu.style";
import type { MenuType, UserMenuItem } from "@/types/menu";
import { useMemo } from "react";
import { SidemenuTop } from "../../atoms/SidemenuTop";
import SidemenuList from "../SidemenuList";
import { SidemenuFooter } from "../../atoms/SidemenuFooter";
import { buildMenuTree } from "@/lib/utils/buildMenuTree";
import { useUserMenus } from "@/lib/hooks/useUserMenus";
import type { UserInfo } from "@/types/domain.types";

interface SidemenuProps {
  isCollapsed?: boolean;
  asideToggle?: () => void;
  onContextMenu: (event: React.MouseEvent, target: any) => void;
  onLogout: () => void;
  userInfo?: UserInfo;
}

const ROOT_PARENT = "0";

/**
 * 백엔드 응답(UserMenuItem) → Sidemenu 가 사용하는 MenuType 으로 변환.
 * - oid       ← menuCd
 * - title     ← menuName
 * - parentId  ← upMenuCd (없거나 '0' 이면 ROOT)
 * - path      ← url
 * - sortRef   ← sort
 * - depth     ← 백엔드가 미리 계산해 준 값
 */
function mapApiMenusToMenuTypes(items: UserMenuItem[]): MenuType[] {
  return items.map((m) => ({
    oid: m.menuCd,
    title: m.menuName,
    icon: m.icon ?? undefined,
    depth: m.depth,
    parentId:
      m.upMenuCd && m.upMenuCd !== ROOT_PARENT ? m.upMenuCd : ROOT_PARENT,
    path: m.url ?? undefined,
    sortRef: m.sort,
  }));
}

export const Sidemenu = ({
  isCollapsed = false,
  asideToggle,
  onContextMenu,
  onLogout,
  userInfo,
}: SidemenuProps) => {
  /**
   * 사용자 메뉴는 GET /api/app/permission/menu-list 에서 받아옵니다.
   * sya_menu × sya_auth × sya_auth_dtl × sya_auth_menu 조인 결과로
   * 이미 권한 필터링이 끝난 상태이므로 별도의 role 필터를 적용하지 않습니다.
   */
  const { data: apiMenus } = useUserMenus();

  const menuTree = useMemo(() => {
    const flat = mapApiMenusToMenuTypes(apiMenus ?? []);
    return buildMenuTree(flat);
  }, [apiMenus]);

  return (
    <S.SidemenuSection $isCollapsed={isCollapsed}>
      <SidemenuTop isCollapsed={isCollapsed} asideToggle={asideToggle} />
      <SidemenuList
        menuList={menuTree}
        onContextMenu={onContextMenu}
        isCollapsed={isCollapsed}
      />
      <SidemenuFooter isCollapsed={isCollapsed} onLogout={onLogout} userInfo={userInfo} />
    </S.SidemenuSection>
  );
};
