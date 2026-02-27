import styled from "styled-components";
interface ModalStyleProps {
  $width?: any;
  $height?: any;
  $padding?: string;
}

export const ModalBg = styled.div`
  position: absolute;
  display: flex;
  width: 100vw;
  height: 100svh;
  top: 0;
  left: 0;
  background: ${(props) => props.theme.colors.black60};
  align-items: center;
  justify-content: center;
  z-index: 998;
`;

export const Modal = styled.div<ModalStyleProps>`
  display: flex;
  background: ${(props) => props.theme.colors.white100};
  border-radius: 6px;
  box-shadow: ${(props) => props.theme.shadows.modal};
  flex-direction: column;
  width: ${(props) =>
    props.$width ? props.$width + "%" : ""}; // ChartModal 사이즈 props 추가
  height: ${(props) =>
    props.$height ? props.$height + "px" : ""}; // ChartModal 사이즈 props 추가
`;

export const ModalTitBox = styled.div`
  display: flex;
  padding: 24px;
  color: ${(props) => props.theme.colors.black80};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 28px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
`;

export const CloseBtnBox = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

export const ModalContentBox = styled.div<ModalStyleProps>`
  display: flex;
  min-width: 300px;
  /* padding: 0 20px; */
  padding: ${(props) => (props.$padding ? props.$padding : "0")};
  color: ${(props) => props.theme.colors.black80};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  flex-direction: column;
  gap: 12px;
  height: 100%; // chartModal Grid 사이즈 추가

  .status_txt {
    display: inline-block;
    margin-bottom: 10px;
    color: ${(props) => props.theme.colors.primary100};
  }

  .toastui-editor-main-container {
    text-align: left !important;
  }

  .toastui-editor-contents table th {
    background-color: #a0a0a0;
  }
`;

export const ModalFormBox = styled.form<{ $flexDirection: "row" | "column" }>`
  display: flex;
  flex-direction: ${(props) => props.$flexDirection};
  gap: 12px;
`;

export const ModalFormSection = styled.div<{
  $flexDirection?: "row" | "column";
}>`
  flex-direction: column;
  flex-direction: ${(props) => props.$flexDirection || "column"};
  gap: 12px;
  display: flex;
  padding: 0 24px;

  /* .toastui-editor-contents {
    height: 450px;
    overflow-y: auto;
    text-align: left;
  } */
`;

export const ModalFormDiv = styled.div<{ $alignItems?: string; $gap?: string }>`
  display: flex;
  gap: ${(props) => (props.$gap ? props.$gap : "12px")};
  align-items: ${(props) => props.$alignItems || "normal"};
`;

export const ModalGridBox = styled.div`
  min-width: 760px;
`;

export const ModalButtonBox = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
