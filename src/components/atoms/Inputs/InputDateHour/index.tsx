import { ChangeEvent } from "react";
import { InputProps, Inputs } from "../Inputs";

interface InputDateHourProps extends InputProps {
  startName?: string;
  endName?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputDateHour = ({
  id,
  label,
  size,
  width,
  direction,
  errored,
  erroredTxt,
  startName,
  endName,
  onChange,
  defaultValue,
}: InputDateHourProps) => {
  return (
    <Inputs
      id={id && id}
      label={label && label}
      size={size}
      width={width}
      direction={direction}
      errored={errored}
      erroredTxt={erroredTxt}
    >
      <input
        name={startName}
        type="datetime-local"
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </Inputs>
  );
};
