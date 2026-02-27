import * as yup from "yup";

export const modalCustomerManageSchema = yup.object({
  customerCode: yup.string().required("거래처 코드를 입력해주세요.").nullable(),
  customerName: yup.string().required("거래처명을 입력해주세요.").nullable(),
  bizNo: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .matches(/^\d{3}-\d{2}-\d{5}$/, "사업자번호 형식이 올바르지 않습니다.")
    .nullable(),
  ceoName: yup.string().nullable(),
  zipName: yup.string().nullable(),
  address: yup.string().nullable(),
  addressDetail: yup.string().nullable(),
  bizType: yup.string().nullable(),
  bizItem: yup.string().nullable(),
  tel: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .matches(/^\d{2,3}-\d{3,4}-\d{4}$/, "전화번호 형식이 올바르지 않습니다.")
    .nullable(),
  hp: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .matches(
      /^01[016789]-\d{3,4}-\d{4}$/,
      "휴대전화번호 형식이 올바르지 않습니다."
    )
    .nullable(),
  fax: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .matches(/^\d{2,3}-\d{3,4}-\d{4}$/, "팩스번호 형식이 올바르지 않습니다.")
    .nullable(),
  email: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .email("이메일 형식이 올바르지 않습니다.")
    .nullable(),
  taxName: yup.string().nullable(),
  remark: yup.string().nullable(),
  useYn: yup.boolean().nullable(),
});
