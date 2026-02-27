import * as yup from "yup";

export const modalMemberSchema = yup
  .object({
    userId: yup.string().required("사용자ID를 입력해주세요.").nullable(), // 사용자 ID
    userName: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .matches(/^[가-힣]{2,5}$/, "한글 이름 2~5자 이내"), // 사용자명
    tel: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)) // 빈 값은 null로 변환 // 전화번호
      .matches(
        /^([0-9]{3})-([0-9]{3,4})-([0-9]{4}$)/,
        "전화번호 양식에 맞게 작성해주세요."
      ),
    hp: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .matches(
        /^([0-9]{3})-([0-9]{3,4})-([0-9]{4}$)/,
        "휴대전화 양식에 맞게 작성해주세요."
      ), // 휴대전화
    email: yup
      .string()
      .nullable() // 이메일
      .transform((value) => (value === "" ? null : value))
      .matches(
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,
        "이메일 양식에 맞게 작성해주세요."
      ),
    joinDate: yup.string().nullable(), // 입사일
    department: yup.string().nullable(), // 부서
    duties: yup.string().nullable(), // 직책
    auth: yup.string().nullable(), // 권한
    userColor: yup.string().nullable(), // 사용자 색상
  })
  .required();
