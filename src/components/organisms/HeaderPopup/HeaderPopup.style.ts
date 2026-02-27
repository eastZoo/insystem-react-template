import styled from "styled-components";

export const HeaderPopupBg = styled.div`
  position: absolute;
  width: calc(100vw - 224px);
  height: calc(100svh - 52px);
  top: 52px;
  right: 0;
  z-index: 99;
`;

export const HeaderPopup = styled.div`
  position: absolute;
  display: flex;
  right: 10px;
  top: -8px;
  padding: 8px 0;
  border-radius: 6px;
  background: ${(props) => props.theme.colors.white100};
  box-shadow: ${(props) => props.theme.shadows.popup};
  flex-direction: column;
`;

export const HeaderPopupList = styled.ul`
  display: flex;
  flex-direction: column;
`;
