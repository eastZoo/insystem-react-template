import * as S from "./SidemenuList.style";
import { SidemenuItem } from "../../atoms/SidemenuItem";
import React from "react";

interface SidemenuListProps {
  menuList: any;
  depth?: number;
  onContextMenu: (event: React.MouseEvent, target: any) => void;
}

const SidemenuList = ({
  menuList,
  depth,
  onContextMenu,
}: SidemenuListProps) => {
  return (
    <S.SidemenuListBox $depth={depth ? depth : 1}>
      {menuList.map((item: any) => {
    
        return (
          <SidemenuItem
            data={item}
            key={item.oid}
            onContextMenu={onContextMenu}
          />
        );
      })}
    </S.SidemenuListBox>
  );
};
export default React.memo(SidemenuList);
