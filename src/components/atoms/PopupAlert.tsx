import type { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { devbaseColors, devbaseRadius } from "@/styles/devbaseTheme";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.55);
  animation: ${fadeIn} 0.18s ease;
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 360px;
  background: ${devbaseColors.bg3};
  border: 1px solid ${devbaseColors.border2};
  border-radius: ${devbaseRadius.lg};
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5);
  animation: ${slideUp} 0.2s ease;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 18px 20px 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${devbaseColors.text};
  letter-spacing: -0.01em;
`;

const Body = styled.div`
  padding: 10px 20px 20px;
  font-size: 13.5px;
  line-height: 1.55;
  color: ${devbaseColors.text2};
  white-space: pre-wrap;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 20px 18px;
  justify-content: flex-end;

  .confirm_btn,
  .cancel_btn {
    padding: 7px 16px;
    border: none;
    border-radius: ${devbaseRadius.md};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .confirm_btn {
    background: ${devbaseColors.primaryBtn};
    color: #fff;
    &:hover {
      background: ${devbaseColors.primaryBtnHover};
    }
  }

  .cancel_btn {
    background: ${devbaseColors.cancelBtn};
    color: ${devbaseColors.text};
    &:hover {
      background: ${devbaseColors.cancelBtnHover};
    }
  }
`;

interface PopupAlertProps {
  title: string;
  text: string;
  buttons: ReactNode;
}

export function PopupAlert({ title, text, buttons }: PopupAlertProps) {
  return (
    <Overlay>
      <Dialog role="alertdialog" aria-modal="true" aria-labelledby="popup-title">
        <Header>
          <Title id="popup-title">{title}</Title>
        </Header>
        <Body>{text}</Body>
        <ButtonRow>{buttons}</ButtonRow>
      </Dialog>
    </Overlay>
  );
}
