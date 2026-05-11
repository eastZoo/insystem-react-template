/**
 * @file validation/schemas.ts
 * @description react-hook-form과 함께 사용하는 yup 스키마 정의
 *
 * yup 스키마를 사용하면 react-hook-form의 resolver와 연동하여
 * 선언적으로 폼 검증을 수행할 수 있습니다.
 *
 * @example
 * // 기본 사용법
 * import { useForm } from "react-hook-form";
 * import { yupResolver } from "@hookform/resolvers/yup";
 * import { loginSchema } from "@/lib/validation";
 *
 * const { register, handleSubmit, formState: { errors } } = useForm({
 *   resolver: yupResolver(loginSchema),
 * });
 */

import * as yup from "yup";
import {
  EMAIL_REGEX,
  PASSWORD_PATTERNS,
  PASSWORD_CONFIG,
  PHONE_PATTERNS,
  NAME_PATTERNS,
  BUSINESS_NUMBER,
  URL_REGEX,
  ZIPCODE_REGEX,
  USERNAME_REGEX,
} from "./rules";
import {
  EMAIL_MESSAGES,
  PASSWORD_MESSAGES,
  PHONE_MESSAGES,
  NAME_MESSAGES,
  BUSINESS_NUMBER_MESSAGES,
  URL_MESSAGES,
  NUMBER_MESSAGES,
  COMMON_MESSAGES,
} from "./messages";

/* ─────────────────────────────────────────────────────────────
 * 기본 필드 스키마 (재사용 가능한 빌딩 블록)
 * ───────────────────────────────────────────────────────────── */

/**
 * 이메일 필드 스키마
 */
export const emailField = yup
  .string()
  .required(EMAIL_MESSAGES.REQUIRED)
  .matches(EMAIL_REGEX, EMAIL_MESSAGES.INVALID);

/**
 * 이메일 필드 스키마 (선택)
 */
export const emailFieldOptional = yup
  .string()
  .nullable()
  .transform((v) => (v === "" ? null : v))
  .matches(EMAIL_REGEX, { message: EMAIL_MESSAGES.INVALID, excludeEmptyString: true });

/**
 * 비밀번호 필드 스키마 (기본: 영문+숫자+특수문자 8자 이상)
 */
export const passwordField = yup
  .string()
  .required(PASSWORD_MESSAGES.REQUIRED)
  .min(PASSWORD_CONFIG.MIN_LENGTH, PASSWORD_MESSAGES.MIN_LENGTH(PASSWORD_CONFIG.MIN_LENGTH))
  .max(PASSWORD_CONFIG.MAX_LENGTH, PASSWORD_MESSAGES.MAX_LENGTH(PASSWORD_CONFIG.MAX_LENGTH))
  .matches(PASSWORD_PATTERNS.NUMBER, PASSWORD_MESSAGES.REQUIRE_NUMBER)
  .matches(PASSWORD_PATTERNS.SPECIAL, PASSWORD_MESSAGES.REQUIRE_SPECIAL);

/**
 * 비밀번호 확인 필드 스키마 (ref 사용)
 * @param refField 참조할 비밀번호 필드명 (기본: "password")
 */
export const passwordConfirmField = (refField = "password") =>
  yup
    .string()
    .required(PASSWORD_MESSAGES.REQUIRED)
    .oneOf([yup.ref(refField)], PASSWORD_MESSAGES.MISMATCH);

/**
 * 전화번호 필드 스키마 (휴대폰)
 */
export const mobileField = yup
  .string()
  .required(PHONE_MESSAGES.REQUIRED)
  .test("mobile", PHONE_MESSAGES.INVALID_MOBILE, (value) => {
    if (!value) return false;
    const clean = value.replace(/\D/g, "");
    return PHONE_PATTERNS.MOBILE.test(clean);
  });

/**
 * 전화번호 필드 스키마 (선택)
 */
export const mobileFieldOptional = yup
  .string()
  .nullable()
  .transform((v) => (v === "" ? null : v))
  .test("mobile", PHONE_MESSAGES.INVALID_MOBILE, (value) => {
    if (!value) return true;
    const clean = value.replace(/\D/g, "");
    return PHONE_PATTERNS.MOBILE.test(clean);
  });

/**
 * 한글 이름 필드 스키마
 */
export const koreanNameField = yup
  .string()
  .required(NAME_MESSAGES.REQUIRED)
  .matches(NAME_PATTERNS.KOREAN, NAME_MESSAGES.INVALID_KOREAN);

/**
 * 영문 이름 필드 스키마
 */
export const englishNameField = yup
  .string()
  .required(NAME_MESSAGES.REQUIRED)
  .matches(NAME_PATTERNS.ENGLISH, NAME_MESSAGES.INVALID_ENGLISH);

/**
 * 이름 필드 스키마 (한글 또는 영문)
 */
export const nameField = yup
  .string()
  .required(NAME_MESSAGES.REQUIRED)
  .matches(NAME_PATTERNS.KOREAN_OR_ENGLISH, NAME_MESSAGES.INVALID_KOREAN);

/**
 * 사업자등록번호 필드 스키마 (체크섬 검증 포함)
 */
export const businessNumberField = yup
  .string()
  .required(BUSINESS_NUMBER_MESSAGES.REQUIRED)
  .test("businessNumber", BUSINESS_NUMBER_MESSAGES.INVALID_CHECKSUM, (value) => {
    if (!value) return false;

    const numbers = value.replace(/\D/g, "");
    if (numbers.length !== 10) return false;

    const digits = numbers.split("").map(Number);
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += digits[i] * BUSINESS_NUMBER.CHECKSUM_KEYS[i];
    }

    sum += Math.floor((digits[8] * 5) / 10);
    const checkDigit = (10 - (sum % 10)) % 10;

    return checkDigit === digits[9];
  });

/**
 * URL 필드 스키마
 */
export const urlField = yup
  .string()
  .required(URL_MESSAGES.REQUIRED)
  .matches(URL_REGEX, URL_MESSAGES.INVALID);

/**
 * URL 필드 스키마 (선택)
 */
export const urlFieldOptional = yup
  .string()
  .nullable()
  .transform((v) => (v === "" ? null : v))
  .matches(URL_REGEX, { message: URL_MESSAGES.INVALID, excludeEmptyString: true });

/**
 * 우편번호 필드 스키마
 */
export const zipcodeField = yup
  .string()
  .required(COMMON_MESSAGES.REQUIRED)
  .matches(ZIPCODE_REGEX, COMMON_MESSAGES.INVALID_FORMAT);

/**
 * 아이디 필드 스키마
 */
export const usernameField = yup
  .string()
  .required(COMMON_MESSAGES.REQUIRED)
  .matches(USERNAME_REGEX, "영문으로 시작하는 4-20자의 영문, 숫자만 사용 가능합니다.");

/**
 * 숫자 필드 스키마
 */
export const numberField = yup
  .number()
  .required(NUMBER_MESSAGES.REQUIRED)
  .typeError(NUMBER_MESSAGES.INVALID);

/**
 * 양의 정수 필드 스키마
 */
export const positiveIntegerField = yup
  .number()
  .required(NUMBER_MESSAGES.REQUIRED)
  .typeError(NUMBER_MESSAGES.INVALID)
  .integer(NUMBER_MESSAGES.INTEGER)
  .positive(NUMBER_MESSAGES.POSITIVE);

/* ─────────────────────────────────────────────────────────────
 * 사전 정의된 폼 스키마
 * ───────────────────────────────────────────────────────────── */

/**
 * 로그인 폼 스키마
 */
export const loginSchema = yup.object({
  email: emailField,
  password: yup.string().required(PASSWORD_MESSAGES.REQUIRED),
});
export type LoginFormData = yup.InferType<typeof loginSchema>;

/**
 * 회원가입 폼 스키마
 */
export const signupSchema = yup.object({
  email: emailField,
  password: passwordField,
  passwordConfirm: passwordConfirmField("password"),
  name: koreanNameField,
  phone: mobileField,
  agreeTerms: yup.boolean().oneOf([true], "이용약관에 동의해주세요."),
  agreePrivacy: yup.boolean().oneOf([true], "개인정보 처리방침에 동의해주세요."),
});
export type SignupFormData = yup.InferType<typeof signupSchema>;

/**
 * 비밀번호 변경 폼 스키마
 */
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("현재 비밀번호를 입력해주세요."),
  newPassword: passwordField,
  newPasswordConfirm: passwordConfirmField("newPassword"),
});
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;

/**
 * 비밀번호 재설정 폼 스키마
 */
export const resetPasswordSchema = yup.object({
  password: passwordField,
  passwordConfirm: passwordConfirmField("password"),
});
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;

/**
 * 프로필 수정 폼 스키마
 */
export const profileSchema = yup.object({
  name: koreanNameField,
  email: emailField,
  phone: mobileFieldOptional,
  address: yup.string().nullable(),
  addressDetail: yup.string().nullable(),
  zipcode: yup.string().nullable(),
});
export type ProfileFormData = yup.InferType<typeof profileSchema>;

/**
 * 사업자 정보 폼 스키마
 */
export const businessInfoSchema = yup.object({
  businessName: yup.string().required("상호명을 입력해주세요."),
  businessNumber: businessNumberField,
  representative: koreanNameField,
  businessType: yup.string().required("업태를 입력해주세요."),
  businessCategory: yup.string().required("업종을 입력해주세요."),
  address: yup.string().required("주소를 입력해주세요."),
  addressDetail: yup.string().nullable(),
  zipcode: zipcodeField,
});
export type BusinessInfoFormData = yup.InferType<typeof businessInfoSchema>;

/**
 * 문의하기 폼 스키마
 */
export const contactSchema = yup.object({
  name: koreanNameField,
  email: emailField,
  phone: mobileFieldOptional,
  title: yup
    .string()
    .required("제목을 입력해주세요.")
    .min(2, COMMON_MESSAGES.MIN_LENGTH(2))
    .max(100, COMMON_MESSAGES.MAX_LENGTH(100)),
  content: yup
    .string()
    .required("내용을 입력해주세요.")
    .min(10, COMMON_MESSAGES.MIN_LENGTH(10))
    .max(1000, COMMON_MESSAGES.MAX_LENGTH(1000)),
});
export type ContactFormData = yup.InferType<typeof contactSchema>;

/* ─────────────────────────────────────────────────────────────
 * 스키마 헬퍼 함수
 * ───────────────────────────────────────────────────────────── */

/**
 * 동적 스키마 생성 헬퍼
 * 조건에 따라 스키마를 동적으로 변경할 때 사용
 *
 * @example
 * const schema = createConditionalSchema({
 *   email: emailField,
 *   phone: mobileField,
 * }, {
 *   businessNumber: isCompany ? businessNumberField : yup.string().nullable(),
 * });
 */
export function createDynamicSchema<T extends yup.ObjectShape>(
  baseFields: T,
  conditionalFields: Partial<T> = {}
) {
  return yup.object({
    ...baseFields,
    ...conditionalFields,
  });
}

/**
 * 필수/선택 필드 토글
 * 기존 스키마를 선택 필드로 변환
 */
export function makeOptional<T extends yup.StringSchema>(schema: T) {
  return schema.notRequired().nullable().transform((v) => (v === "" ? null : v));
}

/* ─────────────────────────────────────────────────────────────
 * 기본 내보내기
 * ───────────────────────────────────────────────────────────── */

export const schemas = {
  // 필드 스키마
  fields: {
    email: emailField,
    emailOptional: emailFieldOptional,
    password: passwordField,
    passwordConfirm: passwordConfirmField,
    mobile: mobileField,
    mobileOptional: mobileFieldOptional,
    koreanName: koreanNameField,
    englishName: englishNameField,
    name: nameField,
    businessNumber: businessNumberField,
    url: urlField,
    urlOptional: urlFieldOptional,
    zipcode: zipcodeField,
    username: usernameField,
    number: numberField,
    positiveInteger: positiveIntegerField,
  },
  // 폼 스키마
  forms: {
    login: loginSchema,
    signup: signupSchema,
    changePassword: changePasswordSchema,
    resetPassword: resetPasswordSchema,
    profile: profileSchema,
    businessInfo: businessInfoSchema,
    contact: contactSchema,
  },
  // 헬퍼
  createDynamicSchema,
  makeOptional,
} as const;

export default schemas;
