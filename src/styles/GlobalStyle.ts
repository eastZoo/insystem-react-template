import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
  }

  html,
  body,
  #root {
    font-size: 10px;
    font-family: 'Pretendard', sans-serif;
    overflow-x: hidden; /* 가로 스크롤 방지 */
  }

  body {
    margin: 0;
    display: block;
    min-height: 100vh;
    color: ${({ theme }) => theme.colors.text};
    background: #fff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden; /* 가로 스크롤 방지 */
  }

  /* 전역 레이아웃: body flex( Vite 기본 ) 시 #root가 콘텐츠 너비로만 줄어 가운데 정렬이 깨짐 */
  #root {
    min-height: 100vh;
    width: 100%;
  }

  a { color: inherit; text-decoration: none; }
  ul, ol { padding: 0; margin: 0; list-style: none; }
  button { cursor: pointer; }
  input, button, textarea, select { font: inherit; }
`;

