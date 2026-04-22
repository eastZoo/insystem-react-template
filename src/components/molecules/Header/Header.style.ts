import styled from "styled-components";

export const HeaderSection = styled.header`
  grid-area: HD;
  display: flex;
  padding: 0 20px;
  background: ${(props) => props.theme.colors.white100};
  border-bottom: 1px solid ${(props) => props.theme.colors.black10};
  align-items: center;
  justify-content: space-between;

  // 화면크기(1400px 미만) 설정
  @media (max-width: 1399px) {
    background: ${(props) => props.theme.colors.primary100};
  }
`;

export const ShipModelTit = styled.div`
  display: flex;
  color: ${(props) => props.theme.colors.black80};
  font-size: 1.6rem;
  align-items: center;
  gap: 4px;

  svg {
    path {
      fill: ${(props) => props.theme.colors.black80};
    }
  }

  // 화면크기(1400px 미만) 설정
  @media (max-width: 1399px) {
    color: ${(props) => props.theme.colors.white100};

    svg {
      path {
        fill: ${(props) => props.theme.colors.white80};
      }
    }
  }
`;

export const HeaderSidemenuBtn = styled.button`
  display: flex;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${(props) => props.theme.colors.black5};

    svg {
      path {
        fill: ${(props) => props.theme.colors.primary100};
      }
    }
  }

  // 화면크기(1400px 미만) 설정
  @media (max-width: 1399px) {
    svg {
      path {
        fill: ${(props) => props.theme.colors.white100};
      }
    }

    &:hover {
      background: ${(props) => props.theme.colors.black38};

      svg {
        path {
          fill: ${(props) => props.theme.colors.white100};
        }
      }
    }
  }
`;

export const HeaderBtnBox = styled.div`
  display: flex;
  gap: 4px;

  svg {
    path {
      fill: ${(props) => props.theme.colors.black60};
      fill-opacity: 1;
    }
  }

  button {
    &:hover {
      background: ${(props) => props.theme.colors.black38};

      svg {
        path {
          fill: ${(props) => props.theme.colors.white100};
        }
      }
    }
  }
`;
