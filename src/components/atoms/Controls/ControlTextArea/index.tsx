import { Control, Controller } from "react-hook-form";
import { InputProps, Inputs } from "../../Inputs/Inputs";
import * as S from "../../Inputs/InputTextarea/InputTextarea.style";
import { ChangeEvent } from "react";

interface ControlTextAreaProps extends InputProps {
  control: Control<any>;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const ControlTextArea = ({
  control,
  name,
  defaultValue,
  onChange,
  size,
  direction,
  label,
  id,
  placeholder,
  width,
  height,
  disabled,
}: ControlTextAreaProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, formState }) => (
        <Inputs
          id={id && id}
          label={label && label}
          size={size}
          width={width}
          direction={direction}
          errored={!!formState.errors[name]}
          erroredTxt={formState.errors[name]?.message}
        >
          <S.Textarea
            id={id && id}
            name={name}
            size={size}
            height={height}
            placeholder={placeholder && placeholder}
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
          />
        </Inputs>
      )}
    />
  );
};
