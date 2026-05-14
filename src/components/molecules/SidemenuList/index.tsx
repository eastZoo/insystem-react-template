import * as S from "./SidemenuList.style";
import { SidemenuItem } from "../../atoms/SidemenuItem";

interface SidemenuListProps {
  menuList: any;
  depth?: number;
  isCollapsed?: boolean;
  onContextMenu: (event: React.MouseEvent, target: any) => void;
}

const SidemenuList = ({
  menuList,
  depth,
  isCollapsed = false,
  onContextMenu,
}: SidemenuListProps) => {
  return (
    <S.SidemenuListBox $depth={depth ?? 1} $isCollapsed={isCollapsed}>
      {menuList.map((item: any) => {
        return (
          <SidemenuItem
            data={item}
            key={item.oid}
            isCollapsed={isCollapsed}
            onContextMenu={onContextMenu}
          />
        );
      })}
    </S.SidemenuListBox>
  );
};
export default SidemenuList;
