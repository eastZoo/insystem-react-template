import styled from "styled-components";

export const ModalUploadGrid = styled.div`
  display: flex;
  width: calc(100vw - 72px);
  max-width: 800px;
  height: calc(40svh);
  min-height: 80px;
  text-align: left;
  flex-direction: column;
  gap: 8px;

  .ag-theme-quartz {
    .ag-root.ag-layout-normal {
      height: 100%;
    }

    .ag-root-wrapper-body.ag-layout-normal {
      min-height: 100px;
    }
  }
`;
