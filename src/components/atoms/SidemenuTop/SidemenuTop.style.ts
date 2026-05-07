import styled from "styled-components";

export const SidemenuTop = styled.div`
  overflow: hidden;
  display: flex;
  width: 100%;
  padding: 0 16px;
  background: #0c4ca3;
  align-items: center;
  gap: 8px;
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

  svg {
    path {
      fill: #ffffff;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const SidemenuTopSpan = styled.span`
  color: #ffffff;
  font-family: "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
`;

export const HeaderTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
  color: #ffffff;
  text-transform: uppercase;
  margin: 0;
`;
