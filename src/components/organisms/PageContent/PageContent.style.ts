import styled, { css } from "styled-components";

interface PageContentStyleProps {
  $shipInfoSet?: boolean;
  $height?: string;
  $gap?: string;
}

interface GridBoxHorizontalProps {
  $gtc?: any;
  $gap?: string;
  $height?: string;
}

export const PageContent = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;
  background-color: #f9f9f9;

  // calendar.css
  .rbc-month-row {
    overflow: visible !important;
    /* height: auto !important; */
  }
  .rbc-row-content {
    /* height: auto !important; */
    overflow: visible !important;
    min-height: 200px;
    /* max-height: 100px; */
  }
  .rbc-today {
    background-color: rgb(233, 254, 255);
  }
  .rbc-header {
    font-size: 14px;
    font-weight: 600;
  }
  .rbc-date-cell {
    padding: 10px 5px;
  }
  .rbc-date-cell button {
    font-size: 14px;
  }
`;

export const PageTitBox = styled.h3`
  display: flex;
  height: 28px;
  padding: 0 4px;
  color: ${(props) => props.theme.colors.black80};
  font-size: 1.9rem;
  font-weight: 600;
  align-items: center;
  gap: 4px;
`;

export const PageContentBox = styled.div<PageContentStyleProps>`
  display: flex;
  /* height: calc(100svh - 128px); */
  height: ${(props) =>
    props.$height ? props.$height : "calc(100svh - 160px)"};
  padding: ${(props) => (props.$height === "100%" ? "0" : "20px")};
  background: ${(props) => props.theme.colors.white100};
  border-radius: ${(props) => (props.$height === "100%" ? "0" : "6px")};
  box-shadow: ${(props) => (props.$height === "100%" ? "none" : props.theme.shadows.field)};
  flex-direction: column;
  gap: ${(props) => (props.$gap ? props.$gap : "16px")};
  overflow: ${(props) => (props.$height === "100%" ? "auto" : "auto")};
  flex: 1;
  min-height: 0;

  ${(props) =>
    props.$shipInfoSet === true &&
    css`
      height: calc(100svh - 176px);
    `}

  .content-init {
    overflow: auto;
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: 16px;

    &::-webkit-scrollbar {
      outline: none;
      border-radius: 10px;
      border: 4px solid transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.colors.black30};
      border: 4px solid ${(props) => props.theme.colors.white100};
      border-radius: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
`;

export const GridBoxHorizontal = styled.div<GridBoxHorizontalProps>`
  display: grid;
  gap: ${(props) => (props.$gap ? props.$gap : "10px")};
  grid-template-columns: ${(props) => (props.$gtc ? props.$gtc : "1fr 3fr")};
  height: ${(props) => (props.$height ? props.$height : "100%")};
`;

export const GridBoxHorizontalThird = styled.div`
  //실적 등록 단위일정 선택 3 그리드 스타일 추가
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 2fr 1fr;
  height: 100%;
`;

export const textContetnt = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
`;
