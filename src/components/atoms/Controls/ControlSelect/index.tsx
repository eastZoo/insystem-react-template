import { Control, Controller } from "react-hook-form";
import { InputProps } from "../../Inputs/Inputs";
import { ChangeEvent } from "react";
import { InputSelect } from "../../Inputs/InputSelect";
import { SelectOption } from "../../../../common/types/selectOption";

interface ControlSelectProps extends InputProps {
  control: Control<any>;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[] | undefined;
  disabled?: boolean;
}

export const ControlSelect = ({
  control,
  defaultValue,
  label,
  size,
  width,
  direction,
  name,
  placeholder,
  options,
  disabled = false,
  onChange,
}: ControlSelectProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, formState }) => (
        <InputSelect
          name={name}
          direction={direction}
          size={size}
          width={width}
          label={label}
          placeholder={placeholder}
          errored={!!formState.errors[name]}
          erroredTxt={formState.errors[name]?.message}
          options={options}
          onChange={(e) => {
            // 우선 field.onChange를 호출
            field.onChange(e.target.value);
            // onChange가 존재하면 호출
            if (onChange) {
              console.log("ControlSelect onChange called");
              onChange(e);
            }
          }}
          value={field.value}
          disabled={disabled}
        />
      )}
    />
  );
};
