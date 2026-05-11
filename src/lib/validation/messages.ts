/**
 * @file validation/messages.ts
 * @description Validation 에러 메시지 상수 정의
 *
 * 메시지는 한글로 정의되어 있으며, 필요 시 다국어 지원을 위해 i18n 라이브러리와 연동 가능합니다.
 */

/**
 * 공통 에러 메시지
 */
export const COMMON_MESSAGES = {
  REQUIRED: "필수 입력 항목입니다.",
  INVALID_FORMAT: "올바른 형식이 아닙니다.",
  MIN_LENGTH: (min: number) => `최소 ${min}자 이상 입력해주세요.`,
  MAX_LENGTH: (max: number) => `최대 ${max}자까지 입력 가능합니다.`,
  BETWEEN_LENGTH: (min: number, max: number) =>
    `${min}자 이상 ${max}자 이하로 입력해주세요.`,
} as const;

/**
 * 이메일 관련 에러 메시지
 */
export const EMAIL_MESSAGES = {
  REQUIRED: "이메일을 입력해주세요.",
  INVALID: "올바른 이메일 형식이 아닙니다.",
} as const;

/**
 * 비밀번호 관련 에러 메시지
 */
export const PASSWORD_MESSAGES = {
  REQUIRED: "비밀번호를 입력해주세요.",
  MIN_LENGTH: (min: number) => `비밀번호는 ${min}자 이상이어야 합니다.`,
  MAX_LENGTH: (max: number) => `비밀번호는 ${max}자 이하여야 합니다.`,
  WEAK: "영문, 숫자, 특수문자를 포함해야 합니다.",
  REQUIRE_UPPERCASE: "대문자를 포함해야 합니다.",
  REQUIRE_LOWERCASE: "소문자를 포함해야 합니다.",
  REQUIRE_NUMBER: "숫자를 포함해야 합니다.",
  REQUIRE_SPECIAL: "특수문자를 포함해야 합니다.",
  MISMATCH: "비밀번호가 일치하지 않습니다.",
} as const;

/**
 * 전화번호 관련 에러 메시지
 */
export const PHONE_MESSAGES = {
  REQUIRED: "전화번호를 입력해주세요.",
  INVALID: "올바른 전화번호 형식이 아닙니다.",
  INVALID_MOBILE: "올바른 휴대폰 번호 형식이 아닙니다.",
  INVALID_LANDLINE: "올바른 유선 전화번호 형식이 아닙니다.",
} as const;

/**
 * 이름 관련 에러 메시지
 */
export const NAME_MESSAGES = {
  REQUIRED: "이름을 입력해주세요.",
  INVALID_KOREAN: "한글 이름만 입력 가능합니다.",
  INVALID_ENGLISH: "영문 이름만 입력 가능합니다.",
  MIN_LENGTH: "이름은 2자 이상 입력해주세요.",
  MAX_LENGTH: "이름은 50자 이하로 입력해주세요.",
} as const;

/**
 * 사업자등록번호 관련 에러 메시지
 */
export const BUSINESS_NUMBER_MESSAGES = {
  REQUIRED: "사업자등록번호를 입력해주세요.",
  INVALID: "올바른 사업자등록번호 형식이 아닙니다.",
  INVALID_CHECKSUM: "유효하지 않은 사업자등록번호입니다.",
} as const;

/**
 * 주민등록번호 관련 에러 메시지
 */
export const RESIDENT_NUMBER_MESSAGES = {
  REQUIRED: "주민등록번호를 입력해주세요.",
  INVALID: "올바른 주민등록번호 형식이 아닙니다.",
  INVALID_CHECKSUM: "유효하지 않은 주민등록번호입니다.",
} as const;

/**
 * 날짜 관련 에러 메시지
 */
export const DATE_MESSAGES = {
  REQUIRED: "날짜를 선택해주세요.",
  INVALID: "올바른 날짜 형식이 아닙니다.",
  PAST_ONLY: "과거 날짜만 선택 가능합니다.",
  FUTURE_ONLY: "미래 날짜만 선택 가능합니다.",
  OUT_OF_RANGE: "선택 가능한 날짜 범위를 벗어났습니다.",
} as const;

/**
 * 숫자 관련 에러 메시지
 */
export const NUMBER_MESSAGES = {
  REQUIRED: "숫자를 입력해주세요.",
  INVALID: "숫자만 입력 가능합니다.",
  MIN: (min: number) => `${min} 이상의 값을 입력해주세요.`,
  MAX: (max: number) => `${max} 이하의 값을 입력해주세요.`,
  POSITIVE: "양수만 입력 가능합니다.",
  INTEGER: "정수만 입력 가능합니다.",
} as const;

/**
 * 파일 관련 에러 메시지
 */
export const FILE_MESSAGES = {
  REQUIRED: "파일을 선택해주세요.",
  INVALID_TYPE: "지원하지 않는 파일 형식입니다.",
  TOO_LARGE: (maxSize: string) => `파일 크기는 ${maxSize} 이하여야 합니다.`,
  TOO_MANY: (max: number) => `최대 ${max}개의 파일만 업로드 가능합니다.`,
} as const;

/**
 * URL 관련 에러 메시지
 */
export const URL_MESSAGES = {
  REQUIRED: "URL을 입력해주세요.",
  INVALID: "올바른 URL 형식이 아닙니다.",
} as const;

/**
 * 주소 관련 에러 메시지
 */
export const ADDRESS_MESSAGES = {
  REQUIRED: "주소를 입력해주세요.",
  ZIPCODE_REQUIRED: "우편번호를 입력해주세요.",
  DETAIL_REQUIRED: "상세주소를 입력해주세요.",
} as const;

/**
 * 계좌번호 관련 에러 메시지
 */
export const BANK_ACCOUNT_MESSAGES = {
  REQUIRED: "계좌번호를 입력해주세요.",
  INVALID: "올바른 계좌번호 형식이 아닙니다.",
} as const;

/**
 * 약관 동의 관련 에러 메시지
 */
export const AGREEMENT_MESSAGES = {
  REQUIRED: "필수 약관에 동의해주세요.",
  ALL_REQUIRED: "모든 필수 약관에 동의해주세요.",
} as const;
