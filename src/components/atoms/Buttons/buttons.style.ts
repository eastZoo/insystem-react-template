import styled, { css } from "styled-components";

interface ButtonProps {
  $size: "xsm" | "sm" | "md" | "md-icon" | "lg";
  $layout:
    | "primary"
    | "secondary"
    | "highlight"
    | "warn"
    | "destructive"
    | "ghost"
    | "icon"
    | "find"
    | "cancelModal"
    | "outline"
    | "selectCondition"
    | "selectCondition active"
    | "disabled";
}

interface TooltipProps {
  $tooltipPosition?: "left" | "center" | "right";
}

export const Buttons = styled.button<ButtonProps>`
  position: relative;
  display: flex;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  // ── SIZE ────────────────────────────────────────────────────────────
  ${(props) =>
    props.$size === "xsm" &&
    css`
      min-width: 26px;
      height: 26px;
      font-size: 1.2rem;
    `}

  ${(props) =>
    props.$size === "sm" &&
    css`
      min-width: 28px;
      height: 28px;
      padding: 0 10px;
      font-size: 1.2rem;
      font-weight: 500;
    `}

  ${(props) =>
    props.$size === "md" &&
    css`
      min-width: 32px;
      height: 32px;
      padding: 0 16px;
      font-size: 1.4rem;
      font-weight: 500;
      flex-grow: 0;
    `}

  ${(props) =>
    props.$size === "md-icon" &&
    css`
      width: 32px;
      height: 32px;
      flex-grow: 0;
    `}

  ${(props) =>
    props.$size === "lg" &&
    css`
      width: 100%;
      height: 48px;
      font-size: 1.6rem;
      font-weight: 600;
    `}

  // ── LAYOUT ──────────────────────────────────────────────────────────

  /* Primary: 차콜 배경 + 흰 글자 */
  ${(props) =>
    props.$layout === "primary" &&
    css`
      color: ${(props) => props.theme.colors.white100};
      border: none;
      background: ${(props) => props.theme.colors.primary100};

      &:hover {
        background: ${(props) => props.theme.colors.primaryHover};
      }
    `}

  /* Disabled: 연한 회색 배경 + 중간 회색 글자 */
  ${(props) =>
    props.$layout === "disabled" &&
    css`
      color: ${(props) => props.theme.colors.black38};
      border: none;
      background: ${(props) => props.theme.colors.black10};
      cursor: default;
    `}

  /* Secondary: 다크 그레이 배경 + 흰 글자 */
  ${(props) =>
    props.$layout === "secondary" &&
    css`
      color: ${(props) => props.theme.colors.white100};
      border: none;
      background: ${(props) => props.theme.colors.secondary100};

      &:hover {
        background: ${(props) => props.theme.colors.black60};
      }
    `}

  /* Highlight: 중간 회색 배경 + 흰 글자 */
  ${(props) =>
    props.$layout === "highlight" &&
    css`
      color: ${(props) => props.theme.colors.white100};
      background: ${(props) => props.theme.colors.black38};
      border: none;

      &:hover {
        background: ${(props) => props.theme.colors.black60};
      }
    `}

  /* Warn: 다크 배경 + 흰 글자 (에러 상황) */
  ${(props) =>
    props.$layout === "warn" &&
    css`
      color: ${(props) => props.theme.colors.white100};
      background: ${(props) => props.theme.colors.black70};
      border: none;

      &:hover {
        background: ${(props) => props.theme.colors.black100};
      }
    `}

  /* Destructive: 흰 배경 + 다크 테두리/글자 (삭제 등 위험 액션 강조) */
  ${(props) =>
    props.$layout === "destructive" &&
    css`
      color: ${(props) => props.theme.colors.black70};
      border: 1px solid ${(props) => props.theme.colors.black70};
      background: ${(props) => props.theme.colors.white100};

      &:hover {
        background: ${(props) => props.theme.colors.black5};
      }
    `}

  /* Ghost: 흰 배경 + 차콜 테두리/글자 */
  ${(props) =>
    props.$layout === "ghost" &&
    css`
      color: ${(props) => props.theme.colors.primary100};
      border: 1px solid ${(props) => props.theme.colors.primary100};
      background: ${(props) => props.theme.colors.white100};

      &:hover {
        background: ${(props) => props.theme.colors.black5};
      }
    `}

  /* CancelModal: 중간 회색 배경 + 흰 글자 */
  ${(props) =>
    props.$layout === "cancelModal" &&
    css`
      color: ${(props) => props.theme.colors.white100};
      border: none;
      background: ${(props) => props.theme.colors.black38};

      &:hover {
        background: ${(props) => props.theme.colors.black60};
      }
    `}

  /* Find: 아이콘 전용 버튼 — 회색 배경 */
  ${(props) =>
    props.$layout === "find" &&
    css`
      display: flex;
      width: 32px;
      border: none;
      padding: 0 !important;
      background: ${(props) => props.theme.colors.black12};
      align-items: center;
      justify-content: center;

      svg path {
        fill: ${(props) => props.theme.colors.black70};
      }

      &:hover {
        background: ${(props) => props.theme.colors.gray100};

        svg path {
          fill: ${(props) => props.theme.colors.black100};
        }
      }
    `}

  /* Icon: 배경 없는 아이콘 버튼 */
  ${(props) =>
    props.$layout === "icon" &&
    css`
      padding: 0 6px;
      border: none;
      background: none;

      svg path {
        fill: ${(props) => props.theme.colors.black38};
      }

      &:hover {
        background: ${(props) => props.theme.colors.black5};

        svg path {
          fill: ${(props) => props.theme.colors.black100};
          fill-opacity: 1;
        }
      }
    `}

  /* Outline: 테두리 버튼 — 연한 회색 테두리 */
  ${(props) =>
    props.$layout === "outline" &&
    css`
      padding: 0 12px 0 6px;
      color: ${(props) => props.theme.colors.black70};
      border: 1px solid ${(props) => props.theme.colors.black12};
      background: none;

      svg path {
        fill: ${(props) => props.theme.colors.black38};
        fill-opacity: 1;
      }

      &:hover {
        color: ${(props) => props.theme.colors.black100};
        background: ${(props) => props.theme.colors.black5};

        svg path {
          fill: ${(props) => props.theme.colors.black100};
          fill-opacity: 1;
        }
      }
    `}

  /* SelectCondition: 선택 조건 토글 버튼 */
  ${(props) =>
    props.$layout.includes("selectCondition") &&
    css`
      color: ${props.$layout.includes("active")
        ? props.theme.colors.white100
        : props.theme.colors.black70};
      border: 1px solid ${(props) => props.theme.colors.black70};
      background: ${props.$layout.includes("active")
        ? props.theme.colors.black70
        : "none"};

      &:hover {
        background: ${(props) => props.theme.colors.black100};
        color: ${(props) => props.theme.colors.white100};
      }
    `}

  /* 네이티브 :disabled 상태 공통 처리 */
  &:disabled {
    color: ${(props) => props.theme.colors.black38} !important;
    background: ${(props) => props.theme.colors.black10} !important;
    cursor: default;
  }
`;

export const ButtonTooltipBox = styled.div<TooltipProps>`
  position: absolute;
  width: 230px;
  padding: 10px 16px;
  font-size: 1.2rem;
  line-height: 16px;
  text-align: left;
  color: ${(props) => props.theme.colors.white100};
  background: ${(props) => props.theme.colors.black70};
  border-radius: 6px;
  z-index: 10;

  ${(props) =>
    props.$tooltipPosition === "left" &&
    css`
      top: 36px;
      left: 0;
    `}

  ${(props) =>
    props.$tooltipPosition === "right" &&
    css`
      top: 36px;
      right: 0;
    `}
`;
