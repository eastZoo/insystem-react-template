import * as yup from "yup";

export const modalStmCodeSchema = yup.object({
  cmcdType: yup.string().required("공통코드 유형을 입력해주세요.").nullable(),
  cmCode: yup.string().required("코드를 입력해주세요.").nullable(),
  cmcdName: yup.string().required("코드명을 입력해주세요.").nullable(),
  cmcdSeq: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === undefined ? null : value
    )
    .nullable(),
  useYn: yup.boolean().required("사용 여부를 입력해주세요.").nullable(),
});
