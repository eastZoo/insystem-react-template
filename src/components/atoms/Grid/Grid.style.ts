import styled from "styled-components";

export const GridBox = styled.div`
  overflow: auto;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 147px;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
  border-radius: 10px;

  .ag-theme-quartz {
    width: 100%;
    height: auto;
    height: calc(100% - 48px);
    min-height: 100px;

    --ag-row-height: 64px;
    --ag-header-height: 44px;

    .ag-overlay-panel {
      padding-top: 40px;
    }

    // 추가
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

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const GridWrapper = styled.div<{
  rowHeight?: number;
  headerHeight?: number;
  groupHeaderHeight?: number;
}>`
  
  height: 100%;
  .ag-root-wrapper {
    border: none;

    // GRID 헤더 배경색/높이 변경
    .ag-header {
      background: #ddd;
      border: none;

      .ag-header-row {
        .ag-header-cell {
          padding: 0 12px;
          border-right: 1px solid #fff;
          background-color: #6A7282;

          &:last-child {
            border-right: none;
          }

          &.custom-header-bg {
            background-color: #eee !important; // 특정 헤더 배경
          }

          &.custom-column-bg {
            background-color: #f7f7f7 !important; // 특정 컬럼 배경
          }

          .ag-header-cell-resize {
            &::after {
              width: 1px;
              background: ${(props) => props.theme.colors.black5};
            }
          }

          .ag-header-cell-label {
            display: flex;
            align-items: center;
            justify-content: center;

            .ag-header-cell-text {
              color: #fff;
              font-size: 1.4rem;
              letter-spacing: 0;
            }
          }
        }

        .ag-header-group-cell {
          justify-content: center;
          color: #333;
          font-size: 1.4rem;
          letter-spacing: 0;
          border-right: 1px solid #fff;

          /* &:last-child {
            border-right: none;
          } */
        }
        .ag-header-cell-comp-wrapper {
          display: flex;
          justify-content: center;
        }
      }
    }

    // GRID 내용 높이/border color 지정
    .ag-body {
      min-height: 50px;

      .ag-row {
        border-color: #eee;
        border-bottom: 1px solid #fff;

        &:last-child {
          border-bottom: none;
        }

        &:nth-child(even) {
          background-color: #f7f7f7;
        }
        &.ag-row-hover:not(.ag-full-width-row)::before,
        &.ag-row-hover.ag-full-width-row.ag-row-group::before {
          background-color: #eee !important;
        }

        &.ag-row-selected {
          background-color: transparent !important;
        }

        &.ag-row-selected::before {
          background-color: transparent !important;
        }

        .ag-cell {
          padding: 12px;
          height: 100%;
          color: #333;
          font-size: 1.4rem;
          letter-spacing: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #e5e5e5;

          &:last-child {
            border-right: none;
          }

          .ag-selection-checkbox {
            margin-right: 0;
          }
        }
      }
    }
  }
`;
