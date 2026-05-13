/**
 * RadioGroup 컴포넌트
 * @description 라디오 버튼 그룹 컴포넌트
 */
import { useCallback } from "react";
import styled from "styled-components";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** 라디오 그룹 이름 */
  name: string;
  /** 옵션 목록 */
  options: RadioOption[];
  /** 현재 선택된 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (value: string) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 가로/세로 방향 */
  direction?: "horizontal" | "vertical";
  /** 간격 */
  gap?: number;
}

export const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  disabled = false,
  direction = "horizontal",
  gap = 16,
}: RadioGroupProps) => {
  const handleChange = useCallback(
    (optionValue: string) => {
      if (!disabled) {
        onChange?.(optionValue);
      }
    },
    [disabled, onChange]
  );

  return (
    <RadioGroupContainer $direction={direction} $gap={gap}>
      {options.map((option) => (
        <RadioLabel
          key={option.value}
          $disabled={disabled || option.disabled}
          $checked={value === option.value}
        >
          <RadioInput
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={disabled || option.disabled}
            onChange={() => handleChange(option.value)}
          />
          <RadioCircle $checked={value === option.value} />
          <RadioText>{option.label}</RadioText>
        </RadioLabel>
      ))}
    </RadioGroupContainer>
  );
};

export default RadioGroup;

/* ========================================
   Styled Components
   ======================================== */

const RadioGroupContainer = styled.div<{
  $direction: "horizontal" | "vertical";
  $gap: number;
}>`
  display: flex;
  flex-direction: ${({ $direction }) =>
    $direction === "horizontal" ? "row" : "column"};
  gap: ${({ $gap }) => $gap}px;
`;

const RadioLabel = styled.label<{ $disabled?: boolean; $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const RadioCircle = styled.span<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid
    ${({ $checked }) => ($checked ? "#2eb6aa" : "rgba(112, 115, 124, 0.4)")};
  background: #ffffff;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $checked }) => ($checked ? "#2eb6aa" : "transparent")};
    transition: all 0.2s ease;
  }
`;

const RadioText = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: rgba(46, 47, 51, 0.88);
`;
