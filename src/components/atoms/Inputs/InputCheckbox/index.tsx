import { InputProps, Inputs } from "../Inputs";
import * as S from "./InputCheckbox.style";

interface InputCheckboxProps extends InputProps {
  defaultChecked?: boolean;
  displayName?: string;
  checked: any;
}

export const InputCheckbox = ({
  type = "checkbox",
  size = "md",
  direction = "column",
  id,
  label,
  width,
  name,
  disabled,
  onChange,
  checked,
  defaultChecked,
  displayName,
}: InputCheckboxProps) => {
  return (
    <Inputs
      id={id && id}
      label={label && label}
      size={size}
      width={width}
      direction={direction}
    >
      <S.InputCheckbox>
        <input
          name={name}
          id={id}
          type={type}
          disabled={disabled}
          onChange={onChange}
          checked={checked}
          defaultChecked={defaultChecked}
        />
        <label htmlFor={id}>{displayName}</label>
      </S.InputCheckbox>
    </Inputs>
  );
};
