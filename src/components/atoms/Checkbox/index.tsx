/**
 * Checkbox 컴포넌트
 * @description 체크박스 컴포넌트
 */
import { useCallback } from "react";
import styled from "styled-components";

export interface CheckboxProps {
  /** 체크박스 라벨 */
  label?: string;
  /** 체크 여부 */
  checked?: boolean;
  /** 값 변경 핸들러 */
  onChange?: (checked: boolean) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 체크박스 이름 */
  name?: string;
  /** 체크박스 값 */
  value?: string;
}

export const Checkbox = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  name,
  value,
}: CheckboxProps) => {
  const handleChange = useCallback(() => {
    if (!disabled) {
      onChange?.(!checked);
    }
  }, [disabled, checked, onChange]);

  return (
    <CheckboxLabel $disabled={disabled}>
      <CheckboxInput
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <CheckboxBox $checked={checked} $disabled={disabled}>
        {checked && (
          <CheckIcon viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </CheckIcon>
        )}
      </CheckboxBox>
      {label && <CheckboxText>{label}</CheckboxText>}
    </CheckboxLabel>
  );
};

export default Checkbox;

/* ========================================
   Styled Components
   ======================================== */

const CheckboxLabel = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxBox = styled.span<{ $checked: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid
    ${({ $checked }) => ($checked ? "#2eb6aa" : "rgba(112, 115, 124, 0.4)")};
  background: ${({ $checked }) => ($checked ? "#2eb6aa" : "#ffffff")};
  transition: all 0.2s ease;
  flex-shrink: 0;
`;

const CheckIcon = styled.svg`
  width: 12px;
  height: 12px;
`;

const CheckboxText = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: rgba(46, 47, 51, 0.88);
`;
