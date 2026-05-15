import styled from "styled-components";

export const GridBox = styled.div<{ $isRadius?: boolean }>`
  overflow: auto;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 147px;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
  border-radius: ${({ $isRadius }) => ($isRadius === true ? "10px" : "0px")};

  .ag-theme-quartz {
    width: 100%;
    height: auto;
    height: calc(100% - 48px);
    min-height: 100px;

    /* ===== Figma 91-2963 디자인 시스템 기반 테마 변수 ===== */
    --ag-font-family: "Pretendard Variable", "Pretendard", sans-serif;
    --ag-font-size: 12px;
    --ag-row-height: 40px;
    --ag-header-height: 40px;
    --ag-background-color: #ffffff;
    --ag-foreground-color: rgba(46, 47, 51, 0.88);
    --ag-header-foreground-color: rgba(46, 47, 51, 0.88);
    --ag-header-background-color: #f7f7f8;
    --ag-odd-row-background-color: #ffffff;
    --ag-border-color: rgba(112, 115, 124, 0.08);
    --ag-row-border-color: rgba(112, 115, 124, 0.08);
    --ag-row-hover-color: rgba(46, 196, 160, 0.15);
    --ag-selected-row-background-color: rgba(46, 196, 160, 0.15);
    --ag-cell-horizontal-padding: 12px;
    --ag-checkbox-checked-color: #0066ff;
    --ag-checkbox-unchecked-color: rgba(112, 115, 124, 0.22);
    --ag-checkbox-border-radius: 4px;

    /* 체크박스 컬럼 스타일 */
    --ag-checkbox-background-color: transparent;
    --ag-icon-size: 16px;

    .ag-overlay-panel {
      padding-top: 40px;
    }

    /* 추가 */
    .ag-header-container,
    .ag-body-viewport {
      min-width: 100% !important;
    }

    .ag-header-viewport {
      overflow: hidden !important;
    }

    .ag-center-cols-viewport {
      overflow-x: auto !important;
    }
  }
`;

export const GridWrapper = styled.div<{
  $rowHeight?: number;
  $headerHeight?: number;
  $groupHeaderHeight?: number;
}>`
  height: 100%;

  .ag-root-wrapper {
    border: none;

    /* ===== 헤더 영역 (Figma: IsGridHeader) ===== */
    .ag-header {
      background: #f7f7f8;
      border: none;
      border-top: 1px solid rgba(112, 115, 124, 0.08);
      border-bottom: 1px solid rgba(112, 115, 124, 0.08);

      .ag-header-row {
        .ag-header-cell {
          padding: 0 12px;
          border-right: 1px solid rgba(112, 115, 124, 0.08);
          background-color: #f7f7f8;

          &:last-child {
            border-right: none;
          }

          &.custom-header-bg {
            background-color: #f7f7f8 !important;
          }

          &.custom-column-bg {
            background-color: #f7f7f8 !important;
          }

          .ag-header-cell-resize {
            &::after {
              width: 1px;
              background: rgba(112, 115, 124, 0.22);
            }
          }

          .ag-header-cell-label {
            display: flex;
            align-items: center;
            justify-content: center;

            .ag-header-cell-text {
              color: rgba(46, 47, 51, 0.88);
              font-family: "Pretendard Variable", "Pretendard", sans-serif;
              font-size: 12px;
              font-weight: 600;
              line-height: 1.334;
              letter-spacing: 0.3024px;
            }
          }
        }

        .ag-header-group-cell {
          justify-content: center;
          color: rgba(46, 47, 51, 0.88);
          font-family: "Pretendard Variable", "Pretendard", sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.334;
          letter-spacing: 0.3024px;
          border-right: 1px solid rgba(128, 128, 128, 0.18);
          background-color: #f7f7f8;

          &:last-child {
            border-right: none;
          }
        }

        .ag-header-cell-comp-wrapper {
          display: flex;
          justify-content: center;
        }
      }
    }

    /* ===== 셀 영역 (Figma: IsGridCell) ===== */
    .ag-body {
      min-height: 50px;

      .ag-row {
        border-color: rgba(112, 115, 124, 0.08);
        border-bottom: none;
        background-color: #ffffff;

        &:last-child {
          border-bottom: none;
        }

        /* 짝수 행도 동일한 흰색 배경 */
        &:nth-child(even) {
          background-color: #ffffff;
        }

        /* 호버 상태 - primary 색상 사용 */
        &.ag-row-hover:not(.ag-full-width-row)::before,
        &.ag-row-hover.ag-full-width-row.ag-row-group::before {
          background-color: rgba(46, 196, 160, 0.08) !important;
        }

        /* 선택 상태 - primary 색상 사용 */
        &.ag-row-selected {
          background-color: rgba(46, 196, 160, 0.15) !important;
        }

        &.ag-row-selected::before {
          background-color: rgba(46, 196, 160, 0.15) !important;
        }

        .ag-cell {
          padding: 0 12px;
          height: 100%;
          color: rgba(46, 47, 51, 0.88);
          font-family: "Pretendard Variable", "Pretendard", sans-serif;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.334;
          letter-spacing: 0.3024px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid rgba(128, 128, 128, 0.18);
          border-bottom: 1px solid rgba(104, 104, 104, 0.08);

          &:last-child {
            border-right: none;
          }

          .ag-selection-checkbox {
            margin-right: 0;
          }

          /* 링크 텍스트 스타일 */
          a,
          .link-text {
            color: #1b2a6b;
            text-decoration: none;
          }

          a:hover,
          .link-text:hover {
            text-decoration: underline;
          }
        }
      }
    }

    /* ===== 체크박스 스타일 (AG-Grid v35+) ===== */
    .ag-selection-checkbox,
    .ag-header-select-all {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ag-checkbox-input-wrapper {
      width: 16px;
      height: 16px;
      flex-shrink: 0;

      &::after {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        border-width: 1.5px;
        border-color: rgba(112, 115, 124, 0.22);
        background-color: transparent;
      }

      &.ag-checked::after {
        background-color: #0066ff;
        border-color: #0066ff;
      }

      &.ag-indeterminate::after {
        background-color: #0066ff;
        border-color: #0066ff;
      }

      input {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }

    /* 체크박스 컬럼 너비 조정 */
    .ag-header-cell[col-id="ag-Grid-SelectionColumn"],
    .ag-cell[col-id="ag-Grid-SelectionColumn"] {
      width: 50px !important;
      min-width: 50px !important;
      max-width: 50px !important;
      padding: 0 12px;
    }
  }
`;
