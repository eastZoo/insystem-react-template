/**
 * @file validation/useValidation.ts
 * @description React state 기반 폼 검증을 위한 커스텀 훅
 *
 * react-hook-form을 사용하지 않을 때 상태 관리와 검증을 쉽게 처리할 수 있습니다.
 *
 * @example
 * // 기본 사용법
 * const { values, errors, setValue, validate, validateAll, getFieldProps } = useValidation({
 *   initialValues: { email: "", password: "" },
 *   rules: {
 *     email: [validators.email],
 *     password: [validators.password],
 *   },
 * });
 *
 * return (
 *   <form onSubmit={(e) => {
 *     e.preventDefault();
 *     const { isValid } = validateAll();
 *     if (isValid) {
 *       // 제출 처리
 *     }
 *   }}>
 *     <input {...getFieldProps("email")} />
 *     {errors.email && <span>{errors.email}</span>}
 *
 *     <input type="password" {...getFieldProps("password")} />
 *     {errors.password && <span>{errors.password}</span>}
 *   </form>
 * );
 */

import { useState, useCallback, useMemo } from "react";
import type {
  ValidationResult,
  FormValidationResult,
  ValidatorFn,
  UseValidationReturn,
} from "./types";

interface UseValidationOptions<T extends Record<string, string>> {
  /** 초기값 */
  initialValues: T;
  /** 필드별 검증 규칙 (validator 함수 배열) */
  rules?: Partial<Record<keyof T, ValidatorFn[]>>;
  /** 값 변경 시 자동 검증 여부 (기본: true) */
  validateOnChange?: boolean;
  /** blur 시 자동 검증 여부 (기본: true) */
  validateOnBlur?: boolean;
}

/**
 * React state 기반 폼 검증 훅
 *
 * @param options 설정 옵션
 * @returns 폼 상태 및 검증 관련 함수들
 */
export function useValidation<T extends Record<string, string>>(
  options: UseValidationOptions<T>
): UseValidationReturn<T> {
  const {
    initialValues,
    rules = {} as Partial<Record<keyof T, ValidatorFn[]>>,
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  // 상태
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});

  /**
   * 단일 필드 검증
   */
  const validate = useCallback(
    (field: keyof T): ValidationResult => {
      const value = values[field];
      const fieldRules = rules[field];

      if (!fieldRules || fieldRules.length === 0) {
        return { isValid: true, message: "" };
      }

      for (const validator of fieldRules) {
        const result = validator(value);
        if (!result.isValid) {
          setErrors((prev) => ({ ...prev, [field]: result.message }));
          return result;
        }
      }

      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });

      return { isValid: true, message: "" };
    },
    [values, rules]
  );

  /**
   * 전체 폼 검증
   */
  const validateAll = useCallback((): FormValidationResult<T> => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field of Object.keys(values) as Array<keyof T>) {
      const fieldRules = rules[field];

      if (!fieldRules || fieldRules.length === 0) {
        continue;
      }

      for (const validator of fieldRules) {
        const result = validator(values[field]);
        if (!result.isValid) {
          newErrors[field] = result.message;
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);

    // 모든 필드를 touched로 설정
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouchedState(allTouched);

    return { isValid, errors: newErrors };
  }, [values, rules]);

  /**
   * 값 설정
   */
  const setValue = useCallback(
    (field: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (validateOnChange && touched[field]) {
        // 다음 렌더링에서 검증 실행
        setTimeout(() => {
          const fieldRules = rules[field];
          if (fieldRules && fieldRules.length > 0) {
            for (const validator of fieldRules) {
              const result = validator(value);
              if (!result.isValid) {
                setErrors((prev) => ({ ...prev, [field]: result.message }));
                return;
              }
            }
            setErrors((prev) => {
              const next = { ...prev };
              delete next[field];
              return next;
            });
          }
        }, 0);
      }
    },
    [validateOnChange, touched, rules]
  );

  /**
   * touched 상태 설정
   */
  const setTouched = useCallback(
    (field: keyof T) => {
      setTouchedState((prev) => ({ ...prev, [field]: true }));

      if (validateOnBlur) {
        validate(field);
      }
    },
    [validateOnBlur, validate]
  );

  /**
   * 폼 리셋
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  /**
   * input props 반환 (편의 함수)
   */
  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(field, e.target.value);
      },
      onBlur: () => {
        setTouched(field);
      },
    }),
    [values, setValue, setTouched]
  );

  /**
   * 전체 폼 유효성 상태 (메모이제이션)
   */
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setTouched,
    validate,
    validateAll,
    reset,
    getFieldProps,
  };
}

/* ─────────────────────────────────────────────────────────────
 * 개별 필드 훅 (간단한 단일 필드 검증용)
 * ───────────────────────────────────────────────────────────── */

interface UseFieldValidationOptions {
  /** 초기값 */
  initialValue?: string;
  /** 검증 함수 배열 */
  validators?: ValidatorFn[];
  /** blur 시 자동 검증 */
  validateOnBlur?: boolean;
}

interface UseFieldValidationReturn {
  value: string;
  error: string;
  touched: boolean;
  isValid: boolean;
  setValue: (value: string) => void;
  setTouched: () => void;
  validate: () => ValidationResult;
  reset: () => void;
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
}

/**
 * 단일 필드 검증 훅
 *
 * @example
 * const email = useFieldValidation({
 *   validators: [validators.required, validators.email],
 * });
 *
 * return (
 *   <>
 *     <input {...email.inputProps} />
 *     {email.touched && email.error && <span>{email.error}</span>}
 *   </>
 * );
 */
export function useFieldValidation(
  options: UseFieldValidationOptions = {}
): UseFieldValidationReturn {
  const {
    initialValue = "",
    validators = [],
    validateOnBlur = true,
  } = options;

  const [value, setValueState] = useState(initialValue);
  const [error, setError] = useState("");
  const [touched, setTouchedState] = useState(false);

  const validate = useCallback((): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        setError(result.message);
        return result;
      }
    }
    setError("");
    return { isValid: true, message: "" };
  }, [value, validators]);

  const setValue = useCallback((newValue: string) => {
    setValueState(newValue);
  }, []);

  const setTouched = useCallback(() => {
    setTouchedState(true);
    if (validateOnBlur) {
      validate();
    }
  }, [validateOnBlur, validate]);

  const reset = useCallback(() => {
    setValueState(initialValue);
    setError("");
    setTouchedState(false);
  }, [initialValue]);

  const inputProps = useMemo(
    () => ({
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
      onBlur: setTouched,
    }),
    [value, setValue, setTouched]
  );

  const isValid = error === "";

  return {
    value,
    error,
    touched,
    isValid,
    setValue,
    setTouched,
    validate,
    reset,
    inputProps,
  };
}

export default useValidation;
