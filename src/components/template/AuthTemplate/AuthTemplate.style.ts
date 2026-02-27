import styled from "styled-components";
import ImgAuthBg from "../../../styles/assets/img/img_login_background.png";

export const AuthTemplate = styled.div`
  display: grid;
  width: 100vw;
  height: 100svh;
  grid-template-columns: repeat(2, 1fr);
`;

export const AuthTitleSection = styled.section`
  position: relative;
  background: url(${ImgAuthBg});
  background-position: center;
  background-size: cover;
`;

export const AuthTitleBg = styled.div`
  position: absolute;
  width: 50vw;
  height: 100svh;
  top: 0;
  left: 0;
  background: ${(props) => props.theme.colors.authBackground};
`;

export const AuthTitleBox = styled.div`
  position: relative;
  display: flex;
  top: 160px;
  color: ${(props) => props.theme.colors.white100};
  font-size: 4.2rem;
  font-weight: 600;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  z-index: 10;

  span {
    color: ${(props) => props.theme.colors.white60};
    font-size: 1.8rem;
    font-weight: 500;
  }
`;

export const AuthInputSection = styled.section`
  display: flex;
  height: 100svh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const AuthLogoBox = styled.div`
  position: absolute;
  bottom: 44px;
`;
