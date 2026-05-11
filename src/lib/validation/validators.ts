/**
 * @file validation/validators.ts
 * @description 순수 함수 형태의 Validator 함수들
 *
 * React state를 사용할 때 직접 호출하여 사용하는 validator 함수들입니다.
 * 모든 함수는 ValidationResult 타입을 반환합니다.
 *
 * @example
 * // 단일 필드 검증
 * const result = validators.email("test@example.com");
 * if (!result.isValid) {
 *   console.log(result.message);
 * }
 *
 * @example
 * // 폼 검증
 * const emailResult = validators.email(formData.email);
 * const passwordResult = validators.password(formData.password);
 */

import type {
  ValidationResult,
  PasswordValidatorOptions,
  PhoneFormat,
  BusinessNumberResult,
} from "./types";
import {
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
} from "./rules";
import {
  COMMON_MESSAGES,
  EMAIL_MESSAGES,
  PASSWORD_MESSAGES,
  PHONE_MESSAGES,
  NAME_MESSAGES,
  BUSINESS_NUMBER_MESSAGES,
  RESIDENT_NUMBER_MESSAGES,
  URL_MESSAGES,
  NUMBER_MESSAGES,
} from "./messages";

/* ─────────────────────────────────────────────────────────────
 * 유틸리티 함수
 * ───────────────────────────────────────────────────────────── */

/**
 * 성공 결과 생성
 */
const success = (): ValidationResult => ({
  isValid: true,
  message: "",
});

/**
 * 실패 결과 생성
 */
const failure = (message: string): ValidationResult => ({
  isValid: false,
  message,
});

/**
 * 값이 비어있는지 확인
 */
const isEmpty = (value: string): boolean => {
  return value === undefined || value === null || value.trim() === "";
};

/* ─────────────────────────────────────────────────────────────
 * 기본 Validators
 * ───────────────────────────────────────────────────────────── */

/**
 * 필수값 검증
 */
export const required = (
  value: string,
  message = COMMON_MESSAGES.REQUIRED
): ValidationResult => {
  return isEmpty(value) ? failure(message) : success();
};

/**
 * 최소 길이 검증
 */
export const minLength = (
  value: string,
  min: number,
  message?: string
): ValidationResult => {
  if (isEmpty(value)) return success();
  return value.length < min
    ? failure(message ?? COMMON_MESSAGES.MIN_LENGTH(min))
    : success();
};

/**
 * 최대 길이 검증
 */
export const maxLength = (
  value: string,
  max: number,
  message?: string
): ValidationResult => {
  if (isEmpty(value)) return success();
  return value.length > max
    ? failure(message ?? COMMON_MESSAGES.MAX_LENGTH(max))
    : success();
};

/**
 * 정규식 패턴 검증
 */
export const pattern = (
  value: string,
  regex: RegExp,
  message = COMMON_MESSAGES.INVALID_FORMAT
): ValidationResult => {
  if (isEmpty(value)) return success();
  return regex.test(value) ? success() : failure(message);
};

/* ─────────────────────────────────────────────────────────────
 * 이메일 Validator
 * ───────────────────────────────────────────────────────────── */

/**
 * 이메일 검증
 * @param value 이메일 문자열
 * @param isRequired 필수 여부 (기본값: true)
 */
export const email = (value: string, isRequired = true): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(EMAIL_MESSAGES.REQUIRED) : success();
  }
  return EMAIL_REGEX.test(value) ? success() : failure(EMAIL_MESSAGES.INVALID);
};

/* ─────────────────────────────────────────────────────────────
 * 비밀번호 Validators
 * ───────────────────────────────────────────────────────────── */

/**
 * 비밀번호 검증 (기본: 영문+숫자+특수문자 8자 이상)
 * @param value 비밀번호 문자열
 * @param options 옵션 (minLength, maxLength, requireUppercase 등)
 */
export const password = (
  value: string,
  options: PasswordValidatorOptions = {}
): ValidationResult => {
  const {
    minLength: min = PASSWORD_CONFIG.MIN_LENGTH,
    maxLength: max = PASSWORD_CONFIG.MAX_LENGTH,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = true,
    requireSpecialChar = true,
  } = options;

  if (isEmpty(value)) {
    return failure(PASSWORD_MESSAGES.REQUIRED);
  }

  if (value.length < min) {
    return failure(PASSWORD_MESSAGES.MIN_LENGTH(min));
  }

  if (value.length > max) {
    return failure(PASSWORD_MESSAGES.MAX_LENGTH(max));
  }

  if (requireUppercase && !PASSWORD_PATTERNS.UPPERCASE.test(value)) {
    return failure(PASSWORD_MESSAGES.REQUIRE_UPPERCASE);
  }

  if (requireLowercase && !PASSWORD_PATTERNS.LOWERCASE.test(value)) {
    return failure(PASSWORD_MESSAGES.REQUIRE_LOWERCASE);
  }

  if (requireNumber && !PASSWORD_PATTERNS.NUMBER.test(value)) {
    return failure(PASSWORD_MESSAGES.REQUIRE_NUMBER);
  }

  if (requireSpecialChar && !PASSWORD_PATTERNS.SPECIAL.test(value)) {
    return failure(PASSWORD_MESSAGES.REQUIRE_SPECIAL);
  }

  return success();
};

/**
 * 비밀번호 확인 검증
 * @param value 확인 비밀번호
 * @param originalPassword 원본 비밀번호
 */
export const passwordConfirm = (
  value: string,
  originalPassword: string
): ValidationResult => {
  if (isEmpty(value)) {
    return failure(PASSWORD_MESSAGES.REQUIRED);
  }
  return value === originalPassword
    ? success()
    : failure(PASSWORD_MESSAGES.MISMATCH);
};

/* ─────────────────────────────────────────────────────────────
 * 전화번호 Validators
 * ───────────────────────────────────────────────────────────── */

/**
 * 전화번호 검증
 * @param value 전화번호 문자열
 * @param format 포맷 타입 (mobile, landline, all)
 * @param isRequired 필수 여부
 */
export const phone = (
  value: string,
  format: PhoneFormat = "all",
  isRequired = true
): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(PHONE_MESSAGES.REQUIRED) : success();
  }

  const cleanValue = value.replace(PHONE_PATTERNS.NUMBERS_ONLY, "");

  switch (format) {
    case "mobile":
      return PHONE_PATTERNS.MOBILE.test(cleanValue)
        ? success()
        : failure(PHONE_MESSAGES.INVALID_MOBILE);
    case "landline":
      return PHONE_PATTERNS.LANDLINE.test(cleanValue)
        ? success()
        : failure(PHONE_MESSAGES.INVALID_LANDLINE);
    case "all":
    default:
      return PHONE_PATTERNS.ALL.test(cleanValue)
        ? success()
        : failure(PHONE_MESSAGES.INVALID);
  }
};

/**
 * 휴대폰 번호 검증 (단축)
 */
export const mobile = (value: string, isRequired = true): ValidationResult => {
  return phone(value, "mobile", isRequired);
};

/* ─────────────────────────────────────────────────────────────
 * 이름 Validators
 * ───────────────────────────────────────────────────────────── */

/**
 * 한글 이름 검증
 * @param value 이름 문자열
 * @param isRequired 필수 여부
 */
export const koreanName = (
  value: string,
  isRequired = true
): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(NAME_MESSAGES.REQUIRED) : success();
  }
  return NAME_PATTERNS.KOREAN.test(value)
    ? success()
    : failure(NAME_MESSAGES.INVALID_KOREAN);
};

/**
 * 영문 이름 검증
 * @param value 이름 문자열
 * @param isRequired 필수 여부
 */
export const englishName = (
  value: string,
  isRequired = true
): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(NAME_MESSAGES.REQUIRED) : success();
  }
  return NAME_PATTERNS.ENGLISH.test(value)
    ? success()
    : failure(NAME_MESSAGES.INVALID_ENGLISH);
};

/**
 * 이름 검증 (한글 또는 영문)
 */
export const name = (value: string, isRequired = true): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(NAME_MESSAGES.REQUIRED) : success();
  }
  return NAME_PATTERNS.KOREAN_OR_ENGLISH.test(value)
    ? success()
    : failure(NAME_MESSAGES.INVALID_KOREAN);
};

/* ─────────────────────────────────────────────────────────────
 * 사업자등록번호 Validator
 * ───────────────────────────────────────────────────────────── */

/**
 * 사업자등록번호 검증 (체크섬 포함)
 * @param value 사업자등록번호 (XXX-XX-XXXXX 또는 XXXXXXXXXX)
 * @param isRequired 필수 여부
 */
export const businessNumber = (
  value: string,
  isRequired = true
): BusinessNumberResult => {
  if (isEmpty(value)) {
    return isRequired
      ? { isValid: false, message: BUSINESS_NUMBER_MESSAGES.REQUIRED }
      : { isValid: true, message: "" };
  }

  // 숫자만 추출
  const numbers = value.replace(/\D/g, "");

  if (numbers.length !== 10) {
    return { isValid: false, message: BUSINESS_NUMBER_MESSAGES.INVALID };
  }

  // 체크섬 검증
  const digits = numbers.split("").map(Number);
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += digits[i] * BUSINESS_NUMBER.CHECKSUM_KEYS[i];
  }

  sum += Math.floor((digits[8] * 5) / 10);
  const checkDigit = (10 - (sum % 10)) % 10;

  if (checkDigit !== digits[9]) {
    return { isValid: false, message: BUSINESS_NUMBER_MESSAGES.INVALID_CHECKSUM };
  }

  return {
    isValid: true,
    message: "",
    formatted: `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`,
  };
};

/* ─────────────────────────────────────────────────────────────
 * 주민등록번호 Validator
 * ───────────────────────────────────────────────────────────── */

/**
 * 주민등록번호 검증 (체크섬 포함)
 * @param value 주민등록번호 (XXXXXX-XXXXXXX 또는 XXXXXXXXXXXXX)
 * @param isRequired 필수 여부
 */
export const residentNumber = (
  value: string,
  isRequired = true
): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired
      ? failure(RESIDENT_NUMBER_MESSAGES.REQUIRED)
      : success();
  }

  // 숫자만 추출
  const numbers = value.replace(/\D/g, "");

  if (numbers.length !== 13) {
    return failure(RESIDENT_NUMBER_MESSAGES.INVALID);
  }

  // 체크섬 검증
  const digits = numbers.split("").map(Number);
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += digits[i] * RESIDENT_NUMBER.CHECKSUM_KEYS[i];
  }

  const checkDigit = (11 - (sum % 11)) % 10;

  if (checkDigit !== digits[12]) {
    return failure(RESIDENT_NUMBER_MESSAGES.INVALID_CHECKSUM);
  }

  return success();
};

/* ─────────────────────────────────────────────────────────────
 * 숫자 Validators
 * ───────────────────────────────────────────────────────────── */

/**
 * 숫자 검증
 */
export const number = (value: string, isRequired = true): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(NUMBER_MESSAGES.REQUIRED) : success();
  }
  return NUMBER_PATTERNS.DECIMAL.test(value)
    ? success()
    : failure(NUMBER_MESSAGES.INVALID);
};

/**
 * 정수 검증
 */
export const integer = (value: string, isRequired = true): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(NUMBER_MESSAGES.REQUIRED) : success();
  }
  return NUMBER_PATTERNS.INTEGER.test(value)
    ? success()
    : failure(NUMBER_MESSAGES.INTEGER);
};

/**
 * 양의 정수 검증
 */
export const positiveInteger = (
  value: string,
  isRequired = true
): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(NUMBER_MESSAGES.REQUIRED) : success();
  }
  return NUMBER_PATTERNS.POSITIVE_INTEGER.test(value)
    ? success()
    : failure(NUMBER_MESSAGES.POSITIVE);
};

/**
 * 숫자 범위 검증
 */
export const numberRange = (
  value: string,
  min: number,
  max: number
): ValidationResult => {
  if (isEmpty(value)) return success();

  const num = parseFloat(value);
  if (isNaN(num)) return failure(NUMBER_MESSAGES.INVALID);
  if (num < min) return failure(NUMBER_MESSAGES.MIN(min));
  if (num > max) return failure(NUMBER_MESSAGES.MAX(max));

  return success();
};

/* ─────────────────────────────────────────────────────────────
 * 기타 Validators
 * ───────────────────────────────────────────────────────────── */

/**
 * URL 검증
 */
export const url = (value: string, isRequired = true): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(URL_MESSAGES.REQUIRED) : success();
  }
  return URL_REGEX.test(value) ? success() : failure(URL_MESSAGES.INVALID);
};

/**
 * 우편번호 검증 (5자리)
 */
export const zipcode = (value: string, isRequired = true): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(COMMON_MESSAGES.REQUIRED) : success();
  }
  return ZIPCODE_REGEX.test(value)
    ? success()
    : failure(COMMON_MESSAGES.INVALID_FORMAT);
};

/**
 * 계좌번호 검증
 */
export const bankAccount = (
  value: string,
  isRequired = true
): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(COMMON_MESSAGES.REQUIRED) : success();
  }
  return BANK_ACCOUNT_REGEX.test(value)
    ? success()
    : failure(COMMON_MESSAGES.INVALID_FORMAT);
};

/**
 * 아이디 검증 (영문 시작, 영문+숫자 4-20자)
 */
export const username = (
  value: string,
  isRequired = true
): ValidationResult => {
  if (isEmpty(value)) {
    return isRequired ? failure(COMMON_MESSAGES.REQUIRED) : success();
  }
  return USERNAME_REGEX.test(value)
    ? success()
    : failure("영문으로 시작하는 4-20자의 영문, 숫자만 사용 가능합니다.");
};

/* ─────────────────────────────────────────────────────────────
 * 복합 Validator (여러 규칙 조합)
 * ───────────────────────────────────────────────────────────── */

/**
 * 여러 validator를 순차적으로 실행
 * 첫 번째 실패한 결과를 반환
 *
 * @example
 * const result = compose(
 *   () => required(value),
 *   () => email(value)
 * );
 */
export const compose = (
  ...validators: Array<() => ValidationResult>
): ValidationResult => {
  for (const validator of validators) {
    const result = validator();
    if (!result.isValid) {
      return result;
    }
  }
  return success();
};

/**
 * 조건부 validator
 * condition이 true일 때만 validator 실행
 */
export const when = (
  condition: boolean,
  validator: () => ValidationResult
): ValidationResult => {
  return condition ? validator() : success();
};

/* ─────────────────────────────────────────────────────────────
 * 기본 내보내기 객체
 * ───────────────────────────────────────────────────────────── */

export const validators = {
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
} as const;

export default validators;
