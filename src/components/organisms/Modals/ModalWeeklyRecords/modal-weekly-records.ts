import * as yup from "yup";
import { dateValidate } from "../../../../common/util/yupTestFunction";

export const modalWeeklyRecordsSchema = yup
  .object({
    weekworkStart: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 금주시작날짜
    weekworkEnd: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 금주종료날짜
    nextWeekworkStart: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 차주시작날짜
    nextWeekworkEnd: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 차주주종료날짜
    weekDescription: yup.string().nullable(), // 작업내용
    // assignedTo: yup.string().required("담당자를 입력해주세요.").nullable(), //담당자
    weeklyRecordsName: yup.string().nullable(), // 주간업무제목
    writer: yup.string().required("작성자를 입력해주세요.").nullable(), //담당자
    significant: yup.string().nullable(), // 특이사항
  })
  .required();
