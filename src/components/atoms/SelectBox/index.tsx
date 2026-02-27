import React from "react";
import * as S from "./SelectBox";
import { HiChevronDown } from "react-icons/hi";

interface SelectOption {
  label: string;
  value: string | number;
}

interface IProp
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  variant?: "default" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  error?: boolean;

  options: SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  width?: string;
}

const SelectBox = ({
  variant = "default",
  size = "medium",
  fullWidth = false,
  error = false,
  width = "150px",
  options,
  placeholder,
  label,
  value,
  required,
  className,
  ...selectProps
}: IProp) => {
  return (
    <S.SelectBoxContainer>
      {label && (
        <label
          htmlFor={selectProps.name}
          className="pl-1 text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="text-왔다-파랑 ml-1">*</span>}
        </label>
      )}
      <S.SelectWrapper>
        <S.SelectStyle
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          error={error}
          className={className}
          {...selectProps}
          value={value}
          style={{ width: width }}
        >
          {placeholder && (
            <option value="" disabled selected={!value}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <S.OptionStyle key={opt.value} value={opt.value}>
              {opt.label}
            </S.OptionStyle>
          ))}
        </S.SelectStyle>
        <S.IconWrapper>
          <HiChevronDown />
        </S.IconWrapper>
      </S.SelectWrapper>
    </S.SelectBoxContainer>
  );
};

export default SelectBox;
