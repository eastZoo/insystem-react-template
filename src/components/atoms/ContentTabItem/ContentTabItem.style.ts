import styled, { css } from "styled-components";

interface TabStatusProps {
  $active?: boolean;
}

export const ContentTabItem = styled.li<TabStatusProps>`
  display: flex;
  height: 26px;
  padding: 0 12px;
  color: ${(props) => props.theme.colors.black100};
  font-size: 1.2rem;
  font-weight: 500;
  border: 1px solid ${(props) => props.theme.colors.black12};
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.black8};
  }

  ${(props) =>
    props.$active &&
    css`
      color: ${(props) => props.theme.colors.white100};
      background: ${(props) => props.theme.colors.black60};
      cursor: default;
    `}
`;
