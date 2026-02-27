// components/Controls/ControlTagSelect.tsx
import { Controller, Control } from "react-hook-form";
import { useMemo } from "react";
import { Tag } from "react-tag-autocomplete";
import { InputProps } from "../../Inputs/Inputs";
import { SelectOption } from "../../../../common/types/selectOption";
import { InputTags } from "../../Inputs/InputTags";

interface ControlTagSelectProps extends InputProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
  options: SelectOption[];
  width?: number;
  userColor?: string;
}

export const ControlTagSelect = ({
  control,
  name,
  label,
  placeholder,
  options,
  size,
  width,
  direction,
  disabled,
}: ControlTagSelectProps) => {
  const suggestions: Tag[] = useMemo(
    () =>
      options.map((opt) => ({
        value: opt.value as string | number,
        label: opt.label,
      })),
    [options]
  );
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { value, onChange }, fieldState }) => {
        const selected = (value || []).map((label: string) => {
          const matched = options.find((opt) => opt.label === label);
          return {
            label,
            value: label,
            userColor: matched?.stmUser_user_color, // 추가
          };
        });
        const handleAdd = (tag: Tag) => {
          if (!value.includes(tag.label)) {
            onChange([...value, tag.label]);
          }
        };

        const handleDelete = (index: number) => {
          const updated = value.filter((_: any, i: number) => i !== index);
          onChange(updated);
        };

        return (
          <InputTags
            label={label}
            size={size}
            width={width}
            direction={direction}
            errored={!!fieldState.error}
            erroredTxt={fieldState.error?.message}
            selected={selected}
            suggestions={suggestions}
            onAdd={handleAdd}
            onDelete={handleDelete}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      }}
    />
  );
};
