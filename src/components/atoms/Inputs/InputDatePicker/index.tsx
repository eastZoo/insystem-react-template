import { ChangeEvent } from "react";
import { InputProps, Inputs } from "../Inputs";
import DatePicker from "react-datepicker";

interface InputDatePickerProps extends InputProps {
  startName?: string;
  endName?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: any) => void;
  startDate?: Date;
  endDates?: Date;
  selected?: [Date | null, Date | null]; // ✅ 범위 배열로 받음
  minDate?: Date;
  selectsStart?: any;
}

export const InputDatePicker = ({
  id,
  label,
  size,
  width,
  direction,
  errored,
  erroredTxt,
  startName,
  onChange,
  selected,
  disabled,
}: InputDatePickerProps) => {
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
      <>
        <DatePicker
          name={startName}
          locale="ko"
          selected={selected?.[0] || null}
          startDate={selected?.[0] || null}
          endDate={selected?.[1] || null}
          selectsRange
          dateFormat="yyyy-MM-dd"
          onChange={onChange}
          disabled={disabled}
          placeholderText="날짜를 선택하세요"
          showMonthDropdown
          useShortMonthInDropdown
          isClearable={true}
        />
      </>
    </Inputs>
  );
};
