/**
 * @file validation/index.ts
 * @description Validation 모듈 진입점
 *
 * 이 모듈은 두 가지 방식의 폼 검증을 지원합니다:
 *
 * 1. react-hook-form + yup 방식 (권장)
 *    - schemas에서 yup 스키마를 import하여 사용
 *    - @hookform/resolvers/yup과 함께 사용
 *
 * 2. React state + validators 방식
 *    - validators에서 순수 함수를 import하여 사용
 *    - useValidation 훅으로 상태 관리
 *
 * @example
 * // 1. react-hook-form + yup
 * import { useForm } from "react-hook-form";
 * import { yupResolver } from "@hookform/resolvers/yup";
 * import { schemas, LoginFormData } from "@/lib/validation";
 *
 * const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
 *   resolver: yupResolver(schemas.forms.login),
 * });
 *
 * @example
 * // 2. React state + validators
 * import { useValidation, validators } from "@/lib/validation";
 *
 * const form = useValidation({
 *   initialValues: { email: "", password: "" },
 *   rules: {
 *     email: [(v) => validators.email(v)],
 *     password: [(v) => validators.password(v)],
 *   },
 * });
 */

// ─────────────────────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────────────────────
export type {
  ValidationResult,
  FormValidationResult,
  ValidatorFn,
  ValidatorOptions,
  PasswordValidatorOptions,
  PhoneFormat,
  BusinessNumberResult,
  FieldState,
  UseValidationReturn,
  ValidationRuleConfig,
  ValidationRules,
} from "./types";

// ─────────────────────────────────────────────────────────────
// 에러 메시지 상수
// ─────────────────────────────────────────────────────────────
export {
  COMMON_MESSAGES,
  EMAIL_MESSAGES,
  PASSWORD_MESSAGES,
  PHONE_MESSAGES,
  NAME_MESSAGES,
  BUSINESS_NUMBER_MESSAGES,
  RESIDENT_NUMBER_MESSAGES,
  DATE_MESSAGES,
  NUMBER_MESSAGES,
  FILE_MESSAGES,
  URL_MESSAGES,
  ADDRESS_MESSAGES,
  BANK_ACCOUNT_MESSAGES,
  AGREEMENT_MESSAGES,
} from "./messages";

// ─────────────────────────────────────────────────────────────
// 정규식 및 규칙
// ─────────────────────────────────────────────────────────────
export {
  EMAIL_REGEX,
  PASSWORD_PATTERNS,
  PASSWORD_CONFIG,
  PHONE_PATTERNS,
  NAME_PATTERNS,
  BUSINESS_NUMBER,
  RESIDENT_NUMBER,
  URL_REGEX,
  NUMBER_PATTERNS,
  ZIPCODE_REGEX,
  BANK_ACCOUNT_REGEX,
  USERNAME_REGEX,
  KOREAN_PATTERNS,
  NO_SPECIAL_CHAR_REGEX,
  WHITESPACE_REGEX,
  DATE_PATTERNS,
} from "./rules";

// ─────────────────────────────────────────────────────────────
// Validators (순수 함수)
// ─────────────────────────────────────────────────────────────
export {
  // 기본
  required,
  minLength,
  maxLength,
  pattern,
  // 이메일
  email,
  // 비밀번호
  password,
  passwordConfirm,
  // 전화번호
  phone,
  mobile,
  // 이름
  koreanName,
  englishName,
  name,
  // 번호
  businessNumber,
  residentNumber,
  // 숫자
  number,
  integer,
  positiveInteger,
  numberRange,
  // 기타
  url,
  zipcode,
  bankAccount,
  username,
  // 유틸
  compose,
  when,
  // 기본 객체
  validators,
} from "./validators";

// ─────────────────────────────────────────────────────────────
// Yup 스키마 (react-hook-form용)
// ─────────────────────────────────────────────────────────────
export {
  // 필드 스키마
  emailField,
  emailFieldOptional,
  passwordField,
  passwordConfirmField,
  mobileField,
  mobileFieldOptional,
  koreanNameField,
  englishNameField,
  nameField,
  businessNumberField,
  urlField,
  urlFieldOptional,
  zipcodeField,
  usernameField,
  numberField,
  positiveIntegerField,
  // 폼 스키마
  loginSchema,
  signupSchema,
  changePasswordSchema,
  resetPasswordSchema,
  profileSchema,
  businessInfoSchema,
  contactSchema,
  // 헬퍼
  createDynamicSchema,
  makeOptional,
  // 기본 객체
  schemas,
} from "./schemas";

// 폼 타입 re-export
export type {
  LoginFormData,
  SignupFormData,
  ChangePasswordFormData,
  ResetPasswordFormData,
  ProfileFormData,
  BusinessInfoFormData,
  ContactFormData,
} from "./schemas";

// ─────────────────────────────────────────────────────────────
// 커스텀 훅 (React state용)
// ─────────────────────────────────────────────────────────────
export { useValidation, useFieldValidation } from "./useValidation";
