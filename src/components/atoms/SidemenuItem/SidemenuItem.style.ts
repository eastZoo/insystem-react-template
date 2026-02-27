import styled, { css } from "styled-components";
import { SidemenuListBox } from "../../organisms/SidemenuList/SidemenuList.style";

interface SidemenuItemProps {
  $depth?: number;
  $submenuToggle?: boolean;
  $menuActive?: boolean;
}

export const SidemenuListItem = styled.div<SidemenuItemProps>`
  display: flex;
  color: ${(props) => props.theme.colors.white60};
  font-weight: 500;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    path {
      fill: ${(props) => props.theme.colors.white38};
    }
  }

  &:hover {
    color: ${(props) => props.theme.colors.white100};
    font-weight: 600;

    svg {
      path {
        fill: ${(props) => props.theme.colors.white100};
      }
    }
  }

  ${(props) =>
    props.$depth === 1 &&
    css`
      height: 44px;
      padding: 0 16px 0 20px;
      font-size: 1.5rem;
    `}

  ${(props) =>
    props.$depth === 2 &&
    css`
      height: 36px;
      padding: 0 16px 0 42px;
      font-size: 1.4rem;
    `}

    ${(props) =>
    props.$depth === 3 &&
    css`
      height: 36px;
      padding: 0 16px 0 56px;
      font-size: 1.4rem;
    `}
`;

export const SidemenuItemTit = styled.div`
  display: flex;
  align-items: Center;
  gap: 8px;

  svg {
    path {
      fill: ${(props) => props.theme.colors.white60};
    }
  }
`;

export const TitBox = styled.div`
  white-space: nowrap;
`;

export const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;

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
        & > ${SidemenuItemTit} {
          color: ${(props) => props.theme.colors.white100};
          font-weight: 600;
        }

        svg {
          path {
            fill: ${(props) => props.theme.colors.white100};
            fill-opacity: 1;
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
        background: ${(props) => props.theme.colors.white12};

        & > ${SidemenuItemTit} {
          color: ${(props) => props.theme.colors.white100};
          font-weight: 600;
        }

        svg {
          path {
            fill: ${(props) => props.theme.colors.white100};
          }
        }
      }
    `}
`;
