import * as yup from "yup";

export const modalEnvironmentalVarSchema = yup
  .object({
    envTitle: yup.string().required("제목을 입력해주세요.").nullable(),
    participantName: yup
      .array()
      .min(1, "작성자를 한 명 이상 선택해주세요.")
      .required("작성자를 입력해주세요.")
      .nullable(),
  })
  .required();
