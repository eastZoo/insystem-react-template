import styled, { css } from "styled-components";

interface PagingButtonProps {
  $active?: boolean;
}

export const Pagination = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

export const PageSizeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: ${(props) => props.theme.colors.black60};
    font-size: 1.2rem;
    font-weight: 500;
  }

  select {
    width: 60px;
    height: 26px;
    color: ${(props) => props.theme.colors.black80};
    font-size: 1.2rem;
    border-left: none;
    border-top: none;
    border-right: none;
    border-bottom: 1px solid ${(props) => props.theme.colors.black12};
  }
`;

export const PagingBox = styled.div`
  display: flex;
  align-items: center;
`;

export const PagingArrowButton = styled.button<PagingButtonProps>`
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 4px;
  background: none;
  transition: background 0.2s ease;

  svg {
    g {
      path {
        fill-opacity: 0.6;
      }
    }
  }

  &:disabled {
    svg {
      g {
        path {
          fill-opacity: 0.2;
        }
      }
    }
  }

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.black5};
    cursor: pointer;
  }
`;

export const PagingNumberButton = styled.button<PagingButtonProps>`
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  color: ${(props) => props.theme.colors.black60};
  font-size: 1.2rem;
  border: none;
  background: none;
  cursor: pointer;

  ${(props) =>
    props.$active &&
    css`
      color: ${(props) => props.theme.colors.primary100};
      font-size: 1.3rem;
      font-weight: 700;
      cursor: default;
    `}
`;
