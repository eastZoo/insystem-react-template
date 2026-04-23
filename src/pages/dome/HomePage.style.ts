import styled from "styled-components";

export const HomePageContainer = styled.div`
  padding: 32px;
  background-color: ${(props) => props.theme.colors.gray50};
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.5px;
`;
