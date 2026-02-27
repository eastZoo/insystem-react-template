import styled from "styled-components";

export const SelectBoxContainer = styled.div`
  /* height: 100%; */
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  /* width: 100%;
  height: 100%; */
`;

export const SelectStyle = styled.select<{
  variant: "default" | "outlined" | "filled";
  size: "small" | "medium" | "large" | number;
  fullWidth: boolean;
  error: boolean;
}>`
  padding-left: 11px;
  padding-right: 33px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.57;
  letter-spacing: -0.28px;
  text-align: left;
  color: #333;

  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  height: ${({ size }) => {
    switch (size) {
      case "small":
        return "36px";
      case "medium":
        return "48px";
      case "large":
        return "56px";
      default:
        return "48px";
    }
  }};
  ${({ size }) => {
    switch (size) {
      case "small":
        return "12px";
      case "medium":
        return "16px";
      case "large":
        return "20px";
      default:
        return "16px";
    }
  }};
  border: ${({ variant, error }) => {
    if (error) return "1px solid #ef4444";
    switch (variant) {
      case "outlined":
        return "1px solid #eee";
      case "filled":
        return "1px solid transparent";
      default:
        return "1px solid #eee";
    }
  }};
  border-radius: ${({ size }) => {
    switch (size) {
      case "small":
        return "8px";
      case "medium":
        return "8px";
      case "large":
        return "10px";
      default:
        return "8px";
    }
  }};
  font-size: ${({ size }) => {
    switch (size) {
      case "small":
        return "14px";
      case "medium":
        return "16px";
      case "large":
        return "18px";
      default:
        return "16px";
    }
  }};
  color: #1f2937;
  background-color: ${({ variant }) => {
    switch (variant) {
      case "filled":
        return "#f9fafb";
      default:
        return "white";
    }
  }};
  transition: all 0.2s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? "#ef4444" : "#a44945")};
    box-shadow: ${({ error }) => (error ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(164, 73, 69, 0.1)")};
  }

  &:hover:not(:focus) {
    border-color: ${({ error }) => (error ? "#ef4444" : "#9ca3af")};
  }

  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #e5e7eb;
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666;

  > svg {
    width: 20px;
    height: auto;
  }
`;

export const OptionStyle = styled.option``;
