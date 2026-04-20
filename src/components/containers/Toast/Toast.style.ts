import styled, { keyframes } from "styled-components";
import { devbaseColors, devbaseRadius } from "@/styles/devbaseTheme";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const ToastViewport = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10050;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: min(380px, calc(100vw - 40px));
`;

export const ToastRoot = styled.div<{ $variant: "success" | "error" | "info" }>`
  pointer-events: auto;
  animation: ${slideIn} 0.22s ease-out;
  padding: 12px 16px;
  border-radius: ${devbaseRadius.md};
  border: 1px solid ${devbaseColors.border2};
  background: ${devbaseColors.bg3};
  color: ${devbaseColors.text};
  font-size: 13px;
  line-height: 1.45;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);

  ${({ $variant }) =>
    $variant === "success" &&
    `
    border-color: ${devbaseColors.tealDim};
    background: linear-gradient(135deg, ${devbaseColors.bg3}, rgba(45,212,160,0.08));
  `}
  ${({ $variant }) =>
    $variant === "error" &&
    `
    border-color: ${devbaseColors.redDim};
    background: linear-gradient(135deg, ${devbaseColors.bg3}, rgba(240,79,79,0.08));
  `}
  ${({ $variant }) =>
    $variant === "info" &&
    `
    border-color: ${devbaseColors.blueDim};
    background: linear-gradient(135deg, ${devbaseColors.bg3}, rgba(77,140,255,0.08));
  `}
`;

export const ToastLabel = styled.span`
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${devbaseColors.text2};
  margin-bottom: 4px;
`;

export const ToastMessage = styled.span`
  color: ${devbaseColors.text};
`;
