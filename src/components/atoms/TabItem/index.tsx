import * as S from "./TabItem.style";
import { ReactComponent as IconClose } from "../../../styles/assets/svg/icon_tab_close.svg";
import { Buttons } from "../Buttons";

interface TabItemProps {
  item?: any;
  active: boolean;
  onClick?: any;
  onContextMenu: (event: React.MouseEvent, target: any) => void;
  onClose?: any;
  isUseClose?: boolean; // 탭의 close버튼 사용 여부
}

export const TabItem = ({
  item,
  active,
  onClick,
  onContextMenu,
  onClose,
  isUseClose = true,
}: TabItemProps) => {
  return (
    <S.TabItem $active={active}>
      <S.TabItemTitle
        onContextMenu={(e) => {
          onContextMenu(e, item.path);
        }}
        $active={active}
        onClick={onClick}
      >
        {item.name}
      </S.TabItemTitle>

      {isUseClose && onClose && !active && (
        <S.TabItemCloseBox>
          <Buttons
            type="button"
            size="xsm"
            layout="icon"
            icon={<IconClose />}
            onClick={onClose}
          />
        </S.TabItemCloseBox>
      )}
    </S.TabItem>
  );
};
