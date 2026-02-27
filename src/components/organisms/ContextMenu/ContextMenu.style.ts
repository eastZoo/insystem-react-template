import styled from "styled-components";

export const ContextMenu = styled.div<{ $visible: boolean }>`
  position: absolute;
  z-index: 1000;
  background: ${(props) => props.theme.colors.white100};
  border: 1px solid ${(props) => props.theme.colors.black12};
  box-shadow: ${(props) => props.theme.shadows.popup};
  padding: 4px 0;
  display: ${({ $visible }: { $visible: boolean }) =>
    $visible ? "block" : "none"};
`;

export const ContextMenuItem = styled.div`
  display: flex;
  height: 32px;
  padding: 0 12px;
  font-size: 1.2rem;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.primaryHover};
    font-weight: 500;
    background: ${(props) => props.theme.colors.primary10};
  }
`;
