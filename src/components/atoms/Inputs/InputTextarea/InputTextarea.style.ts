import styled, { css } from "styled-components";

export const Textarea = styled.textarea<any>`
  height: ${(props) => (props.height ? props.height + "px" : "auto")};
  resize: none;

  ${(props) =>
    props.size === "md" &&
    css`
      padding: 8px 10px;
      font-size: 1.2rem;
    `}

  ${(props) =>
    props.size === "lg" &&
    css`
      padding: 12px 16px;
      font-size: 1.4rem;
    `}


  &::-webkit-scrollbar {
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.black38};
    border: 5px solid ${(props) => props.theme.colors.white100};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;
