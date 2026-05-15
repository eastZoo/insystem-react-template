/**
 * FormTable - 폼 테이블 컴포넌트
 *
 * 레이블-입력 필드 구조의 폼을 테이블 형식으로 표현하는 컴포넌트
 *
 * @example
 * // 기본 사용법
 * <FormTable>
 *   <FormTable.Column>
 *     <FormTable.Row isFirst>
 *       <FormTable.Label>코드</FormTable.Label>
 *       <FormTable.Cell>
 *         <IsInputText value={value} />
 *       </FormTable.Cell>
 *     </FormTable.Row>
 *   </FormTable.Column>
 * </FormTable>
 *
 * @example
 * // FormField 단축 컴포넌트 사용
 * <FormTable>
 *   <FormTable.Column>
 *     <FormField label="코드" isFirst>
 *       <IsInputText value={value} />
 *     </FormField>
 *     <FormField label="코드명" required>
 *       <IsInputText value={value} />
 *     </FormField>
 *     <FormField label="사용여부" isLast>
 *       <IsRadio ... />
 *     </FormField>
 *   </FormTable.Column>
 * </FormTable>
 */
import React from "react";
import * as S from "./index.style";

/* ========================================
   타입 정의
   ======================================== */

/** FormTable 컨테이너 Props */
export interface FormTableProps {
  children: React.ReactNode;
  /** 컬럼 간 간격 (기본: 16px) */
  gap?: number;
  /** 패딩 (기본: 8px) */
  padding?: number;
  /** 추가 className */
  className?: string;
}

/** FormTableColumn Props */
export interface FormTableColumnProps {
  children: React.ReactNode;
  /** 컬럼 너비 (flex 값, 기본: 1) */
  flex?: number;
  /** 고정 너비 */
  width?: number | string;
  /** 추가 className */
  className?: string;
}

/** FormTableRow Props */
export interface FormTableRowProps {
  children: React.ReactNode;
  /** 첫 번째 행 여부 (높이 34px) */
  isFirst?: boolean;
  /** 마지막 행 여부 (높이 34px) */
  isLast?: boolean;
  /** 멀티라인 여부 (높이 auto) */
  multiLine?: boolean;
  /** 추가 className */
  className?: string;
}

/** FormTableLabel Props */
export interface FormTableLabelProps {
  children: React.ReactNode;
  /** 필수 필드 여부 (별표 표시) */
  required?: boolean;
  /** 멀티라인 여부 (상단 정렬) */
  multiLine?: boolean;
  /** 라벨 너비 (기본: 100px) */
  width?: number | string;
  /** 추가 className */
  className?: string;
}

/** FormTableCell Props */
export interface FormTableCellProps {
  children: React.ReactNode;
  /** 멀티라인 여부 (상단 정렬) */
  multiLine?: boolean;
  /** 추가 className */
  className?: string;
}

/** FormField Props (단축 컴포넌트) */
export interface FormFieldProps {
  /** 라벨 텍스트 */
  label: string;
  /** 입력 필드 */
  children: React.ReactNode;
  /** 필수 필드 여부 */
  required?: boolean;
  /** 첫 번째 행 여부 */
  isFirst?: boolean;
  /** 마지막 행 여부 */
  isLast?: boolean;
  /** 멀티라인 여부 */
  multiLine?: boolean;
  /** 라벨 너비 */
  labelWidth?: number | string;
  /** 추가 className */
  className?: string;
}

/* ========================================
   컴포넌트 구현
   ======================================== */

/** FormTable 컨테이너 */
function FormTableRoot({
  children,
  gap = 16,
  padding = 8,
  className,
}: FormTableProps) {
  return (
    <S.FormTableContainer $gap={gap} $padding={padding} className={className}>
      {children}
    </S.FormTableContainer>
  );
}

/** FormTableColumn - 컬럼 컨테이너 */
function FormTableColumn({
  children,
  flex = 1,
  width,
  className,
}: FormTableColumnProps) {
  return (
    <S.FormTableColumnStyled $flex={flex} $width={width} className={className}>
      {children}
    </S.FormTableColumnStyled>
  );
}

/** FormTableRow - 행 컨테이너 */
function FormTableRow({
  children,
  isFirst = false,
  isLast = false,
  multiLine = false,
  className,
}: FormTableRowProps) {
  return (
    <S.FormTableRowStyled
      $isFirst={isFirst}
      $isLast={isLast}
      $multiLine={multiLine}
      className={className}
    >
      {children}
    </S.FormTableRowStyled>
  );
}

/** FormTableLabel - 라벨 셀 */
function FormTableLabel({
  children,
  required = false,
  multiLine = false,
  width = 100,
  className,
}: FormTableLabelProps) {
  return (
    <S.FormTableLabelStyled
      $required={required}
      $multiLine={multiLine}
      $width={width}
      className={className}
    >
      {children}
    </S.FormTableLabelStyled>
  );
}

/** FormTableCell - 입력 셀 */
function FormTableCell({
  children,
  multiLine = false,
  className,
}: FormTableCellProps) {
  return (
    <S.FormTableCellStyled $multiLine={multiLine} className={className}>
      {children}
    </S.FormTableCellStyled>
  );
}

/** FormField - 단축 컴포넌트 (Row + Label + Cell 조합) */
export function FormField({
  label,
  children,
  required = false,
  isFirst = false,
  isLast = false,
  multiLine = false,
  labelWidth = 100,
  className,
}: FormFieldProps) {
  return (
    <FormTableRow
      isFirst={isFirst}
      isLast={isLast}
      multiLine={multiLine}
      className={className}
    >
      <FormTableLabel required={required} multiLine={multiLine} width={labelWidth}>
        {label}
      </FormTableLabel>
      <FormTableCell multiLine={multiLine}>{children}</FormTableCell>
    </FormTableRow>
  );
}

/* ========================================
   Compound Component 패턴
   ======================================== */

/** FormTable 컴포넌트 (Compound Component 패턴) */
export const FormTable = Object.assign(FormTableRoot, {
  Column: FormTableColumn,
  Row: FormTableRow,
  Label: FormTableLabel,
  Cell: FormTableCell,
});

/* ========================================
   개별 Export (하위 호환성)
   ======================================== */

export {
  FormTableRoot,
  FormTableColumn,
  FormTableRow,
  FormTableLabel,
  FormTableCell,
};

export default FormTable;
