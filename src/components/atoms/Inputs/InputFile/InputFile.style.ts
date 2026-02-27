import styled, { css } from "styled-components";
import { InputProps } from "../Inputs";

interface InputFileProps {
  $placeholder?: boolean;
}

export const InputFileLabel = styled.label<InputProps>`
  display: flex;
  border: 1px solid ${(props) => props.theme.colors.black12};
  border-radius: 6px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  input {
    display: none;
  }

  // SIZE
  ${(props) =>
    props.size === "md" &&
    css`
      height: 32px;
      padding: 0 10px;
      font-size: 1.2rem;
    `}

  ${(props) =>
    props.size === "lg" &&
    css`
      height: 48px;
      padding: 0 16px;
      font-size: 1.4rem;
    `}
`;

export const InputFilePlaceholder = styled.div<InputFileProps>`
  overflow: hidden;
  width: calc(100% - 20px);
  color: ${(props) => props.theme.colors.black80};
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${(props) =>
    props.$placeholder &&
    css`
      color: ${(props) => props.theme.colors.black38};
    `};
`;
