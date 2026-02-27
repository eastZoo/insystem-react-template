import styled from "styled-components";

export const ExplainText = styled.p`
  display: flex;
  color: ${(props) => props.theme.colors.black60};
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.8rem;
  letter-spacing: 0;
  align-item: center;

  span {
    &.bold {
      color: ${(props) => props.theme.colors.primary100};
      font-size: 1.3rem;
      font-weight: 600;
    }

    &.title {
      padding-right: 8px;
      margin-right: 8px;
      color: ${(props) => props.theme.colors.black100};
      border-right: 1px solid ${(props) => props.theme.colors.black10};
    }
  }
`;
