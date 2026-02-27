import styled, { keyframes } from "styled-components";
interface LoadingProps {
  width?: number;
  height?: number;
}
export const LoadSpin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
`;

export const Loading = styled.div<LoadingProps>`
  position: relative;
  display: inline-block;
  width: ${(props) => props.width + "px" || "60px"};
  height: ${(props) => props.height + "px" || "60px"};
  border-radius: 50%;
  vertical-align: middle;
  animation: ${LoadSpin} 1.2s infinite linear;

  &:before {
    position: absolute;
    content: "";
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    box-shadow: 5px -5px 0 ${(props) => props.theme.colors.primary5},
      5px 5px 0 ${(props) => props.theme.colors.primary10},
      -5px 5px 0 ${(props) => props.theme.colors.primary5},
      -5px -5px 0 ${(props) => props.theme.colors.primary10};
    border-radius: 50%;
  }

  &:after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: -3px;
    left: -3px;
    border-radius: 50%;
    z-index: 2;
  }
`;

export const LoadingTxt = styled.span`
  color: ${(props) => props.theme.colors.primary100};
  font-size: 1.4rem;
  font-weight: 600;
  opacity: 0.7;
`;
