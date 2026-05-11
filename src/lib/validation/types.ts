/**
 * @file validation/types.ts
 * @description Validation 관련 TypeScript 타입 정의
 */

/**
 * 단일 필드 Validation 결과
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * 전체 폼 Validation 결과
 */
export interface FormValidationResult<T extends Record<string, unknown>> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

/**
 * Validator 함수 타입
 * @param value - 검증할 값
 * @returns ValidationResult 객체
 */
export type ValidatorFn = (value: string) => ValidationResult;

/**
 * Validator 옵션 타입
 */
export interface ValidatorOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customMessage?: string;
}

/**
 * 비밀번호 검증 옵션
 */
export interface PasswordValidatorOptions {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}

/**
 * 전화번호 포맷 타입
 */
export type PhoneFormat = "mobile" | "landline" | "all";

/**
 * 사업자등록번호 검증 결과 (체크섬 포함)
 */
export interface BusinessNumberResult extends ValidationResult {
  formatted?: string;
}

/**
 * useValidation 훅에서 사용하는 필드 상태
 */
export interface FieldState {
  value: string;
  error: string;
  touched: boolean;
  isValid: boolean;
}

/**
 * useValidation 훅 반환 타입
 */
export interface UseValidationReturn<T extends Record<string, string>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  setValue: (field: keyof T, value: string) => void;
  setTouched: (field: keyof T) => void;
  validate: (field: keyof T) => ValidationResult;
  validateAll: () => FormValidationResult<T>;
  reset: () => void;
  getFieldProps: (field: keyof T) => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
}

/**
 * Validation 규칙 설정 타입
 */
export interface ValidationRuleConfig {
  validator: ValidatorFn;
  message?: string;
}

/**
 * 폼 필드 Validation 규칙 맵
 */
export type ValidationRules<T extends Record<string, string>> = Partial<
  Record<keyof T, ValidatorFn[]>
>;
