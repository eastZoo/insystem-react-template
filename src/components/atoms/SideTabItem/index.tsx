import * as S from "./SideTabItem.style";
import { ReactComponent as IconArrow } from "../../../styles/assets/svg/icon_sidemenu_arrow.svg";
import { useState } from "react";
import { SideTabList } from "../../molecules/SideTabList";

interface SidetTabItemProps {
  data: any;
  activeValue?: any;
  onClickSub?: (lowMcyName: string) => void;
  isOpen: boolean; // 현재 열려 있는지 여부
  setOpenTabId: (id: string | null) => void; // 열린 탭의 ID를 설정하는 함수
  hoverUse?: boolean;
}

export const SideTabItem = ({
  data,
  activeValue,
  onClickSub,
  isOpen,
  setOpenTabId,
  hoverUse,
}: SidetTabItemProps) => {
  const [subTab, setSubTab] = useState(false);

  const subTabToggle = () => {
    setSubTab(!subTab);
    if (subTab === false) {
      onClickSub && onClickSub(data.title);
    }
  };

  // const handleClick = () => {};

  return (
    <>
      {data.submenu ? (
        <S.SideTabItem $submenuToggle={subTab}>
          <S.SideTabItemTit
            $depth={data.depth}
            onClick={data.submenu && subTabToggle}
          >
            {data.title}{" "}
            <IconArrow transform={subTab ? `rotate(180)` : `rotate(0)`} />
          </S.SideTabItemTit>
          <SideTabList
            hoverUse={hoverUse}
            depth={data.depth + 1}
            tabList={data.submenu}
            openTabId={isOpen ? data.id : null} // 하위 목록에 openTabId 전달
            setOpenTabId={setOpenTabId} // 하위 목록에 setOpenTabId 전달
          />
        </S.SideTabItem>
      ) : (
        <S.SideTabItem $depth={data.depth}>
          <S.SideTabItemTit
            $depth={data.depth}
            // onClick={handleClick}
            onClick={data.onClick ? data.onClick : onClickSub}
            style={
              activeValue === data.value
                ? { background: "#4B45E70d", fontWeight: "600" }
                : { background: "none" }
            }
          >
            {data.title}
            {activeValue === data.value && (
              <IconArrow transform={`rotate(-90)`} />
            )}
          </S.SideTabItemTit>
        </S.SideTabItem>
      )}
    </>
  );
};
