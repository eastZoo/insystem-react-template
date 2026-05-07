import styled, { css } from "styled-components";
import { SidemenuListBox } from "../../organisms/SidemenuList/SidemenuList.style";

interface SidemenuItemProps {
  $depth?: number;
  $submenuToggle?: boolean;
  $menuActive?: boolean;
}

export const SidemenuListItem = styled.div<SidemenuItemProps>`
  display: flex;
  color: #99A1AF;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.28px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  overflow: hidden;

  svg {
    path {
      fill: #99A1AF;
    }
  }

  &:hover {
    background: rgba(12, 76, 163, 0.05);
    color: #0C4CA3;
    font-weight: 700;

    svg {
      path {
        fill: #0C4CA3;
      }
    }
  }

  ${(props) =>
    props.$depth === 1 &&
    css`
      height: 40px;
      padding: 10px 12px 10px 16px;
    `}

  ${(props) =>
    props.$depth === 2 &&
    css`
      height: 40px;
      padding: 10px 12px 10px 32px;
    `}

  ${(props) =>
    props.$depth === 3 &&
    css`
      height: 40px;
      padding: 10px 12px 10px 48px;
    `}
`;

export const SidemenuItemTit = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TitBox = styled.div`
  white-space: nowrap;
`;

export const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;

  svg {
    width: 18px;
    height: 18px;

    path {
      fill: currentColor;
    }
  }
`;

export const ArrowIcon = styled.span<{ $open: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  transition:
    transform 0.25s ease,
    opacity 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  ${SidemenuListItem}:hover & {
    opacity: 1;
  }
`;

export const SidemenuItemBox = styled.li<SidemenuItemProps>`
  // 하위메뉴 OPEN/CLOSE
  ${(props) =>
    props.$submenuToggle === true &&
    css`
      & > ${SidemenuListItem} {
        color: #0C4CA3;
        font-weight: 700;

        svg {
          path {
            fill: #0C4CA3;
          }
        }
      }

      & > ${SidemenuListBox} {
        max-height: 100svh;
        transition: max-height 0.4s ease-in-out;
      }
    `}

  ${(props) =>
    props.$submenuToggle === false &&
    css`
      & > ${SidemenuListBox} {
        max-height: 0px;
        transition: max-height 0.2s ease-in-out;
      }
    `}

  // 해당 메뉴 ACTIVE/UNACTIVE
  ${(props) =>
    props.$menuActive === true &&
    css`
      & > ${SidemenuListItem} {
        background: rgba(12, 76, 163, 0.1);
        color: #0C4CA3;
        font-weight: 700;

        svg {
          path {
            fill: #0C4CA3;
          }
        }
      }
    `}
`;
