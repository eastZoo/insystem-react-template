import { Control, Controller } from "react-hook-form";
import { ChangeEvent } from "react";
import { InputProps, Inputs } from "../../Inputs/Inputs";

interface ControlTelProps extends InputProps {
  control: Control<any>;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

export const ControlTel = ({
  type = "text",
  size = "md",
  direction = "column",
  id,
  label,
  placeholder,
  width,
  name,
  disabled,
  control,
  defaultValue,
  maxLength,
}: ControlTelProps) => {
  const handlePhoneNumberChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    // 휴대폰 번호 입력시 자동으로 '-' 추가
    const phoneNumber = e.target.value.replace(/[^0-9]/g, "");
    let result = "";
    if (phoneNumber.length < 4) {
      result = phoneNumber;
    } else if (phoneNumber.length < 7) {
      result = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3);
    } else if (phoneNumber.length < 11) {
      result =
        phoneNumber.substring(0, 3) +
        "-" +
        phoneNumber.substring(3, 6) +
        "-" +
        phoneNumber.substring(6);
    } else {
      result =
        phoneNumber.substring(0, 3) +
        "-" +
        phoneNumber.substring(3, 7) +
        "-" +
        phoneNumber.substring(7);
    }

    onChange(result);
  };

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
            onChange={(e) => {
              field.onChange(e);
              handlePhoneNumberChange(e, field.onChange);
            }}
            value={field.value}
            disabled={disabled}
            maxLength={maxLength}
          />
        </Inputs>
      )}
    />
  );
};
