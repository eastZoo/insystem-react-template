import React from "react";
import * as S from "./RadioButton.style";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonProps {
  options: RadioOption[];
  name: string;
  value?: string;
  onChange?: (name: string, value: RadioOption) => void;
  disabled?: boolean;
  layout?: "flex" | "grid";
  gridColumns?: number;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  name,
  value,
  onChange,
  disabled = false,
  layout = "flex",
  gridColumns = 8,
}) => {
  const handleChange = (optionValue: RadioOption) => {
    if (!disabled && onChange) {
      onChange(name, optionValue);
    }
  };

  return (
    <S.RadioButtonContainer layout={layout} $gridColumns={gridColumns}>
      {options.map((option) => (
        <S.RadioButtonLabel key={option.value}>
          <S.RadioButtonInput
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => handleChange(option)}
            disabled={disabled}
          />
          {option.label}
        </S.RadioButtonLabel>
      ))}
    </S.RadioButtonContainer>
  );
};

export default RadioButton;
