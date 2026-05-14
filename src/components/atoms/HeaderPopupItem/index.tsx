import styled from "styled-components";

interface HeaderPopupItemProps {
  title: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

export const HeaderPopupItem = ({ title, icon, onClick }: HeaderPopupItemProps) => {
  return (
    <ItemWrapper onClick={onClick}>
      <IconWrapper>{icon}</IconWrapper>
      <Title>{title}</Title>
    </ItemWrapper>
  );
};

const ItemWrapper = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.span`
  font-size: 14px;
  color: #333;
`;
