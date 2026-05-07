import styled from "styled-components";

interface SidemenuListProps {
  $depth?: number;
}

export const SidemenuListBox = styled.ul<SidemenuListProps>`
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  width: 100%;
  padding: ${(props) => (props.$depth === 1 ? "18px 16px" : "0")};
  flex-direction: column;
  gap: 4px;

  &::-webkit-scrollbar {
    width: 6px;
    outline: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #D1D5DC;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: #F3F4F6;
  }
`;
