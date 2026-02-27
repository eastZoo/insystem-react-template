import styled from "styled-components";

export const LoginFormBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const LoginFormTit = styled.h2`
  color: ${(props) => props.theme.colors.black80};
  font-size: 3.6rem;
  font-weight: 600;
`;

export const LoginForm = styled.form`
  display: flex;
  width: 400px;
  flex-direction: column;
  gap: 20px;
`;

export const LoginFormExp = styled.p`
  color: ${(props) => props.theme.colors.black60};
  font-size: 1.3rem;
  font-weight: 500;
`;
