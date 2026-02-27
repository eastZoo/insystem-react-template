import * as S from "./ContextMenu.style"; // 위에서 만든 스타일드 컴포넌트 파일

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  handleOpenInNewTab: () => void;
  handleOpenInNewWindow: () => void;
}
const ContextMenu = ({
  visible,
  x,
  y,
  handleOpenInNewTab,
  handleOpenInNewWindow,
}: ContextMenuProps) => {
  return (
    <S.ContextMenu $visible={visible} style={{ top: y, left: x }}>
      <S.ContextMenuItem onClick={handleOpenInNewTab}>
        새 탭에서 링크 열기
      </S.ContextMenuItem>
      <S.ContextMenuItem onClick={handleOpenInNewWindow}>
        새 창에서 링크 열기
      </S.ContextMenuItem>
    </S.ContextMenu>
  );
};

export default ContextMenu;
