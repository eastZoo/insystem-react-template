import styled from "styled-components";

export const SidemenuTop = styled.div`
  overflow: hidden;
  display: flex;
  width: 100%;
  padding: 0 13px;
  background: ${(props) => props.theme.colors.primary100};
  align-items: center;
  gap: 4px;
`;

export const SidemenuBtn = styled.button`
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
    background: ${(props) => props.theme.colors.black30};
  }
`;

export const SidemenuTopSpan = styled.span`
  color: ${(props) => props.theme.colors.white100};
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
`;
