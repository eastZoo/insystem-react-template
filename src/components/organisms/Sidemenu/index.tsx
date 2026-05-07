import * as S from "./Sidemenu.style";
import { useAtomValue } from "jotai";
import { menuState } from "@/store/menu";
import { SidemenuTop } from "../../atoms/SidemenuTop";
import SidemenuList from "../SidemenuList";

interface SidemenuProps {
  asideToggle?: () => void;
  onContextMenu: (event: React.MouseEvent, target: any) => void;
}

/**
 * 사이드바 메뉴 컴포넌트
 *
 * - menuState atom에서 트리 구조의 메뉴 데이터를 가져옴
 * - API에서 이미 권한 필터링된 메뉴만 내려오므로 추가 필터링 불필요
 */
export const Sidemenu = ({
  asideToggle,
  onContextMenu,
}: SidemenuProps) => {
  // useMenuData 훅에서 API 데이터를 가져와 menuState에 저장함
  const menuList = useAtomValue(menuState);

  return (
    <S.SidemenuSection>
      <SidemenuTop asideToggle={asideToggle} />
      <SidemenuList
        menuList={menuList}
        onContextMenu={onContextMenu}
      />
    </S.SidemenuSection>
  );
};
