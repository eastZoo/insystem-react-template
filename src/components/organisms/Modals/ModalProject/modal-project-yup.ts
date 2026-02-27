import * as yup from "yup";
import { dateValidate } from "../../../../common/util/yupTestFunction";

export const modalProjectSchema = yup
  .object({
    projectName: yup.string().required("프로젝트명을 입력해주세요.").nullable(), // 프로젝트명
    projectCategory: yup.string().nullable(), // 프로젝트 구분
    description: yup.string().nullable(), // 설명
    projectDateStart: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 시작날짜
    projectDateEnd: yup
      .string()
      .nullable()
      .test(
        "is-valid-date",
        "올바른 날짜 형식(yyyy-mm-dd)을 입력해주세요.",
        dateValidate
      ), // 종료날짜
    projectManager: yup.string().nullable(), // PM
    projectPhase: yup.string().nullable(), // 프로젝트단계
    projectSource: yup.string().nullable(), // 자체/외주
    totalAmountExclTax: yup.number().nullable(), // 총금액(부가세별도)
    paymentMethod: yup.string().nullable(), // 입금방법
    advancePayment: yup.number().nullable(), // 선금
    interimPayment: yup.number().nullable(), // 중도금
    finalPayment: yup.number().nullable(), // 잔금
    introducingClient: yup.string().nullable(), // 도입거래처
    salesClient: yup.string().nullable(), // 매출거래처
  })
  .required();
