/**
 * @file validation/rules.ts
 * @description Validation에 사용되는 정규식 패턴 및 규칙 상수 정의
 *
 * 모든 정규식 패턴은 이 파일에서 중앙 관리됩니다.
 * validators.ts와 schemas.ts에서 이 규칙들을 import하여 사용합니다.
 */

/**
 * 이메일 정규식 패턴
 * - 로컬 파트: 영문, 숫자, 특수문자(._%+-)
 * - 도메인: 영문, 숫자, 하이픈
 * - TLD: 2자 이상의 영문
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * 비밀번호 정규식 패턴
 */
export const PASSWORD_PATTERNS = {
  /** 영문 대문자 포함 */
  UPPERCASE: /[A-Z]/,
  /** 영문 소문자 포함 */
  LOWERCASE: /[a-z]/,
  /** 숫자 포함 */
  NUMBER: /[0-9]/,
  /** 특수문자 포함 */
  SPECIAL: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
  /** 영문+숫자+특수문자 조합 (8자 이상) */
  STRONG: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
  /** 영문+숫자 조합 (6자 이상) */
  MEDIUM: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
} as const;

/**
 * 비밀번호 강도 설정
 */
export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 20,
} as const;

/**
 * 전화번호 정규식 패턴
 */
export const PHONE_PATTERNS = {
  /** 휴대폰 번호 (010-XXXX-XXXX 형식, 하이픈 선택적) */
  MOBILE: /^01[016789]-?\d{3,4}-?\d{4}$/,
  /** 유선 전화번호 (02-XXXX-XXXX 또는 0XX-XXX-XXXX 형식, 하이픈 선택적) */
  LANDLINE: /^0\d{1,2}-?\d{3,4}-?\d{4}$/,
  /** 모든 전화번호 (휴대폰 + 유선) */
  ALL: /^0\d{1,2}-?\d{3,4}-?\d{4}$/,
  /** 숫자만 추출 */
  NUMBERS_ONLY: /\D/g,
} as const;

/**
 * 이름 정규식 패턴
 */
export const NAME_PATTERNS = {
  /** 한글 이름 (2-10자, 공백 허용) */
  KOREAN: /^[가-힣\s]{2,10}$/,
  /** 영문 이름 (2-50자, 공백 허용) */
  ENGLISH: /^[a-zA-Z\s]{2,50}$/,
  /** 한글 또는 영문 이름 */
  KOREAN_OR_ENGLISH: /^([가-힣\s]{2,10}|[a-zA-Z\s]{2,50})$/,
} as const;

/**
 * 사업자등록번호 정규식 및 체크섬 계수
 */
export const BUSINESS_NUMBER = {
  /** 사업자등록번호 형식 (XXX-XX-XXXXX, 하이픈 선택적) */
  PATTERN: /^\d{3}-?\d{2}-?\d{5}$/,
  /** 체크섬 계산용 계수 */
  CHECKSUM_KEYS: [1, 3, 7, 1, 3, 7, 1, 3, 5] as const,
} as const;

/**
 * 주민등록번호 정규식 및 체크섬 계수
 */
export const RESIDENT_NUMBER = {
  /** 주민등록번호 형식 (XXXXXX-XXXXXXX, 하이픈 선택적) */
  PATTERN: /^\d{6}-?[1-4]\d{6}$/,
  /** 체크섬 계산용 계수 */
  CHECKSUM_KEYS: [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5] as const,
} as const;

/**
 * URL 정규식 패턴
 */
export const URL_REGEX =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * 숫자 정규식 패턴
 */
export const NUMBER_PATTERNS = {
  /** 정수만 */
  INTEGER: /^-?\d+$/,
  /** 양의 정수만 */
  POSITIVE_INTEGER: /^\d+$/,
  /** 소수점 포함 숫자 */
  DECIMAL: /^-?\d+(\.\d+)?$/,
  /** 금액 형식 (콤마 포함) */
  CURRENCY: /^[\d,]+$/,
} as const;

/**
 * 우편번호 정규식 패턴 (5자리)
 */
export const ZIPCODE_REGEX = /^\d{5}$/;

/**
 * 계좌번호 정규식 패턴 (숫자와 하이픈만)
 */
export const BANK_ACCOUNT_REGEX = /^[\d-]{10,20}$/;

/**
 * 아이디 정규식 패턴 (영문으로 시작, 영문+숫자 조합, 4-20자)
 */
export const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;

/**
 * 한글 정규식 패턴
 */
export const KOREAN_PATTERNS = {
  /** 한글만 */
  ONLY: /^[가-힣]+$/,
  /** 한글과 공백 */
  WITH_SPACE: /^[가-힣\s]+$/,
  /** 한글, 영문, 숫자 */
  WITH_ALPHANUMERIC: /^[가-힣a-zA-Z0-9]+$/,
} as const;

/**
 * 특수문자 제외 정규식
 */
export const NO_SPECIAL_CHAR_REGEX = /^[가-힣a-zA-Z0-9\s]+$/;

/**
 * 공백 제거 정규식
 */
export const WHITESPACE_REGEX = /\s/g;

/**
 * 날짜 형식 정규식
 */
export const DATE_PATTERNS = {
  /** YYYY-MM-DD */
  ISO: /^\d{4}-\d{2}-\d{2}$/,
  /** YYYY.MM.DD */
  DOT: /^\d{4}\.\d{2}\.\d{2}$/,
  /** YYYY/MM/DD */
  SLASH: /^\d{4}\/\d{2}\/\d{2}$/,
  /** YYYYMMDD */
  COMPACT: /^\d{8}$/,
} as const;
