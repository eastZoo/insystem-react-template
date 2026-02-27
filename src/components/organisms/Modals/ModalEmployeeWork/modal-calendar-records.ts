import * as yup from "yup";
import { dateValidate } from "../../../../common/util/yupTestFunction";

export const modalCalendarRecordsSchema = yup
  .object({
    workTitle: yup.string().required("제목을 입력해주세요.").nullable(),
    // 근무현황 제목
    employeeDescription: yup.string().nullable(), // 근무현황 설명
    employeeWorkStart: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 근무현황 시작날짜

    employeeWorkEnd: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 근무현황 시작날짜
    userName: yup
      .array()
      .min(1, "담당자를 한 명 이상 선택해주세요.")
      .required("담당자를 입력해주세요.")
      .nullable(),
  })
  .required();
