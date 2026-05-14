import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { IsInputText } from "insystem-atoms";
import styled from "styled-components";

interface ControlTextProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  type?: "text" | "password";
  size?: "xs" | "sm" | "md" | "lg";
  width?: number;
  direction?: "row" | "column";
  label?: string;
  placeholder?: string;
  explain?: string;
}

export const ControlText = <T extends FieldValues>({
  control,
  name,
  type = "text",
  size = "md",
  width,
  direction = "row",
  label,
  placeholder,
  explain,
}: ControlTextProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldWrapper $width={width} $direction={direction}>
          <IsInputText
            {...field}
            type={type}
            size={size === "md" ? "medium" : size === "sm" ? "small" : size === "xs" ? "xSmall" : "large"}
            label={label}
            position={direction === "column" ? "column" : "row"}
            placeholderText={placeholder}
            fullWidth
            status={fieldState.error ? "error" : "default"}
            hintText={fieldState.error?.message}
          />
          {explain && <ExplainText>{explain}</ExplainText>}
        </FieldWrapper>
      )}
    />
  );
};

const FieldWrapper = styled.div<{ $width?: number; $direction: string }>`
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => ($width ? `${$width}px` : "100%")};
  gap: 4px;
`;

const ExplainText = styled.span`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;
