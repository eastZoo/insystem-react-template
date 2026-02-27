import { Control, Controller } from "react-hook-form";
import { ChangeEvent } from "react";
import { InputProps, Inputs } from "../../Inputs/Inputs";

interface ControlNumberProps extends InputProps {
  control: Control<any>;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}

export const ControlNumber = ({
  type = "text",
  size = "md",
  direction = "column",
  step,
  id,
  label,
  placeholder,
  width,
  name,
  disabled,
  control,
  defaultValue,
}: ControlNumberProps) => {
  // let value = e.target.value;
  // value = Number(value.replaceAll(',', ''));
  // const formatValue = value.toLocaleString('ko-KR'); //[5]
  // input.value = formatValue;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, formState }) => (
        <Inputs
          id={id}
          label={label}
          size={size}
          width={width}
          direction={direction}
          errored={!!formState.errors[name]}
          erroredTxt={formState.errors[name]?.message}
        >
          <input
            id={id}
            placeholder={placeholder}
            type={type}
            step={step}
            onChange={field.onChange}
            value={field.value}
            disabled={disabled}
          />
        </Inputs>
      )}
    />
  );
};
