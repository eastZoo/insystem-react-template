import styled from "styled-components";

interface SidemenuListProps {
  $depth?: number;
}

export const SidemenuListBox = styled.ul<SidemenuListProps>`
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  width: 100%;
  padding: ${(props) => (props.$depth === 1 ? "16px 0" : "0")};
  flex-direction: column;

  &::-webkit-scrollbar {
    outline: none;
    border-radius: 10px;
    border: 4px solid transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.white38};
    border: 4px solid ${(props) => props.theme.colors.scrollTrack};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.colors.scrollTrack};
  }
`;
