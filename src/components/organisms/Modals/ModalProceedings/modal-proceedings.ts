import * as yup from "yup";
import { dateValidate } from "../../../../common/util/yupTestFunction";

export const modalProceedingsSchema = yup
  .object({
    proceedingsTitle: yup.string().required("제목을 입력해주세요.").nullable(),
    proceedingsDateStart: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 회의날짜
    proceedingsDescription: yup.string().nullable(), // 회의내용
    participantName: yup
      .array()
      .min(1, "참석자를 한 명 이상 선택해주세요.")
      .required("참석자를 입력해주세요.")
      .nullable(),
  })
  .required();
