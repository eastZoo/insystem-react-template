/**
 * FormTable 스타일 컴포넌트
 */
import styled from "styled-components";

/* ========================================
   FormTable 컨테이너
   ======================================== */

/** 폼 테이블 컨테이너 */
export const FormTableContainer = styled.div<{
  $gap: number;
  $padding: number;
}>`
  display: flex;
  gap: ${({ $gap }) => $gap}px;
  padding: ${({ $padding }) => $padding}px;
  flex: 1;
  overflow: auto;
`;

/* ========================================
   FormTableColumn
   ======================================== */

/** 폼 테이블 컬럼 */
export const FormTableColumnStyled = styled.div<{
  $flex: number;
  $width?: number | string;
}>`
  flex: ${({ $flex, $width }) => ($width ? "none" : `${$flex} 1 0`)};
  width: ${({ $width }) =>
    $width ? (typeof $width === "number" ? `${$width}px` : $width) : "auto"};
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(160, 170, 191, 0.08);
`;

/* ========================================
   FormTableRow
   ======================================== */

/** 폼 테이블 행 */
export const FormTableRowStyled = styled.div<{
  $isFirst?: boolean;
  $isLast?: boolean;
  $multiLine?: boolean;
}>`
  display: flex;
  align-items: stretch;
  min-height: ${({ $isFirst, $isLast, $multiLine }) =>
    $multiLine ? "auto" : $isFirst || $isLast ? "34px" : "40px"};
  border-bottom: 1px solid rgba(160, 170, 191, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

/* ========================================
   FormTableLabel
   ======================================== */

/** 폼 테이블 라벨 셀 */
export const FormTableLabelStyled = styled.div<{
  $required?: boolean;
  $multiLine?: boolean;
  $width?: number | string;
}>`
  display: flex;
  align-items: ${({ $multiLine }) => ($multiLine ? "flex-start" : "center")};
  width: ${({ $width }) =>
    $width ? (typeof $width === "number" ? `${$width}px` : $width) : "100px"};
  padding: ${({ $multiLine }) => ($multiLine ? "10px 12px" : "0 12px")};
  background: rgba(160, 170, 191, 0.12);
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.385;
  letter-spacing: 0.25px;
  color: rgba(46, 47, 51, 0.88);
  flex-shrink: 0;

  ${({ $required }) =>
    $required &&
    `
    &::after {
      content: "*";
      color: #ff4d4f;
      margin-left: 2px;
    }
  `}
`;

/* ========================================
   FormTableCell
   ======================================== */

/** 폼 테이블 입력 셀 */
export const FormTableCellStyled = styled.div<{
  $multiLine?: boolean;
}>`
  flex: 1;
  display: flex;
  align-items: ${({ $multiLine }) => ($multiLine ? "flex-start" : "center")};
  padding: ${({ $multiLine }) => ($multiLine ? "8px" : "4px 8px")};
  gap: 4px;
  flex-wrap: wrap;
`;
