import * as yup from "yup";
import { dateValidate } from "../../../../common/util/yupTestFunction";

export const modalDocumentManageSchema = yup
  .object({
    documentTitle: yup.string().required("제목을 입력해주세요.").nullable(),
    documentDivision: yup
      .string()
      .required("문서구분을 선택해주세요.")
      .nullable(),
    documentWriteDate: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 회의날짜
    documentDescription: yup.string().nullable(), // 회의내용
    participantName: yup.string().required("작성자를 입력해주세요.").nullable(),
  })
  .required();
