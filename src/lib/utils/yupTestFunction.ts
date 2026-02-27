import dayjs from "dayjs";
import { AnyObject, TestFunction } from "yup";

export const dateValidate: TestFunction<
  string | null | undefined,
  AnyObject
> = (value) => !!value || dayjs(value, "YYYY-MM-DD", true).isValid();
