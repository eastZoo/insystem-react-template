import * as yup from "yup";

export const modalAccessInfoSchema = yup
  .object({
    accessTitle: yup.string().required("제목을 입력해주세요.").nullable(),
    accessDescription: yup.string().nullable(), // 내용
  })
  .required();
