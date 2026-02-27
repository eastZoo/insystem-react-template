import styled, { css } from "styled-components";
import { SidemenuListBox } from "@/components/organisms/SidemenuList/SidemenuList.style";
import {
  SidemenuTop,
  SidemenuTopSpan,
} from "@/components/atoms/SidemenuTop/SidemenuTop.style";
import {
  SidemenuItemBox,
  SidemenuListItem,
  TitBox,
} from "@/components/atoms/SidemenuItem/SidemenuItem.style";

interface MainBoxProps {
  $asideOpen: boolean;
}

export const MainTemplate = styled.div<MainBoxProps>`
  display: grid;
  width: 100vw;
  height: 100svh;
  grid-template-areas:
    "MN HD"
    "MN CT";
  grid-template-columns: ${({ $asideOpen }) =>
    $asideOpen ? "224px auto" : "58px auto"};
  grid-template-rows: 52px auto;
  transition: all 0.3s ease;

  // 사이드메뉴 OPEN/CLOSE
  ${({ $asideOpen }) =>
    $asideOpen === false &&
    css`
      ${SidemenuTop} {
        ${SidemenuTopSpan} {
          display: none;
        }
      }

      ${SidemenuListItem} {
        ${TitBox} {
          display: none;
        }

        & > svg {
          display: none;
        }
      }

      ${SidemenuItemBox} {
        & > ${SidemenuListBox} {
          max-height: 0px;
        }
      }
    `}

  // 화면크기(1400px 미만) 설정
  @media (max-width: 1399px) {
    grid-template-columns: ${({ $asideOpen }) =>
      $asideOpen ? "224px auto" : "0 auto"};

    // 사이드메뉴 OPEN/CLOSE
    ${({ $asideOpen }) =>
      $asideOpen === false &&
      css`
        ${SidemenuTop} {
          display: none;
        }
      `}
  }
`;

export const ContentSection = styled.section`
  position: relative;
  overflow: hidden;
  grid-area: CT;
  height: calc(100svh - 52px);
  background: ${(props) => props.theme.colors.primary5};
  display: flex;
  flex-direction: column;
`;
