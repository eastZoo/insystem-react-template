import { Control, Controller } from "react-hook-form";
import { InputProps } from "../../Inputs/Inputs";
import { ChangeEvent } from "react";
import * as S from "../../Inputs/InputFile/InputFile.style";
import { ReactComponent as IconAttach } from "../../../../styles/assets/svg/icon_attach.svg";

interface ControlFileProps extends InputProps {
  control: Control<any>;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  accept?: string;
}

export const ControlFile = ({
  control,
  defaultValue,
  label,
  size,
  name,
  placeholder,
  accept,
}: ControlFileProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, formState }) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "start",
            fontSize: "1.2rem",
          }}
        >
          <label>{label}</label>
          <S.InputFileLabel size={size}>
            <>
              <S.InputFilePlaceholder
                $placeholder={
                  !field.value || field.value.length === 0 ? true : false
                }
              >
                {!field.value || field.value.length === 0
                  ? placeholder
                  : field.value.name}
              </S.InputFilePlaceholder>
              <IconAttach />
              <input
                name={name}
                type="file"
                accept={accept}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  field.onChange({
                    target: {
                      value: e.target.files && e.target.files[0],
                      name: field.name,
                    },
                  })
                }
              />
            </>
          </S.InputFileLabel>
        </div>
      )}
    />
  );
};
