import * as S from "./ContentTabItem.style";

interface ContentTabItemProps {
  title?: string;
  active: boolean;
  onClick?: any;
}

export const ContentTabItem = ({
  title,
  active,
  onClick,
}: ContentTabItemProps) => {
  return (
    <S.ContentTabItem $active={active} onClick={onClick}>
      {title}
    </S.ContentTabItem>
  );
};
