/**
 * FilterBar 컴포넌트
 * @description 검색 필터 영역을 구성하는 재사용 가능한 컴포넌트
 * - 여러 행(row)의 필터 입력 필드를 지원
 * - 기본 검색/초기화 버튼 제공
 * - 커스텀 버튼 추가 가능
 */
import React from "react";
import styled from "styled-components";
import { IsButton } from "insystem-atoms";
import { SearchIcon } from "@/styles/icons";

/* ========================================
   타입 정의
   ======================================== */

/** 필터 아이템 - 컴포넌트만 전달하거나 width 옵션과 함께 전달 */
export type FilterBarItem =
  | React.ReactNode
  | {
      /** 필터 컴포넌트 */
      element: React.ReactNode;
      /** 개별 너비 설정 (기본값 사용 시 생략 가능, "auto"로 설정 시 고정 너비 없음) */
      width?: number | string | "auto";
    };

export interface FilterBarRow {
  /** 행에 표시할 필터 컴포넌트들 */
  items: FilterBarItem[];
}

export interface FilterBarProps {
  /** 필터 행 배열 - 각 행에 필터 컴포넌트 배열을 전달 */
  rows: FilterBarRow[];
  /** 검색 버튼 클릭 핸들러 */
  onSearch?: () => void;
  /** 초기화 버튼 클릭 핸들러 */
  onClear?: () => void;
  /** 검색 버튼 텍스트 (기본: "검색") */
  searchButtonText?: string;
  /** 초기화 버튼 텍스트 (기본: "초기화") */
  clearButtonText?: string;
  /** 검색 버튼 표시 여부 (기본: true) */
  showSearchButton?: boolean;
  /** 초기화 버튼 표시 여부 (기본: true) */
  showClearButton?: boolean;
  /** 검색 버튼 아이콘 표시 여부 (기본: true) */
  showSearchIcon?: boolean;
  /** 커스텀 버튼들 - 검색/초기화 버튼 앞에 추가됨 */
  customButtons?: React.ReactNode;
  /** 추가 버튼들 - 검색/초기화 버튼 뒤에 추가됨 */
  extraButtons?: React.ReactNode;
  /** 필터 필드 기본 너비 (기본: 200px) */
  fieldWidth?: number | string;
  /** 필터 필드 간 간격 (기본: 16px) */
  gap?: number;
  /** 컨테이너 className */
  className?: string;
}

/* ========================================
   메인 컴포넌트
   ======================================== */

/**
 * FilterBar - 검색 필터 영역 컴포넌트
 *
 * @example
 * // 기본 사용법
 * <FilterBar
 *   rows={[
 *     {
 *       items: [
 *         <IsInputText label="부서" value={dept} onChange={...} />,
 *         <IsInputText label="사원명" value={name} onChange={...} />,
 *         <IsSelect label="재직구분" value={status} onChange={...} />,
 *         // 체크박스는 고정 너비 없이 auto로 설정
 *         { element: <IsCheckbox label="Check" checked={...} />, width: "auto" },
 *       ]
 *     },
 *     {
 *       items: [
 *         <IsSelect label="분류" value={category} onChange={...} />,
 *         <IsSelect label="형태" value={type} onChange={...} />,
 *       ]
 *     }
 *   ]}
 *   onSearch={handleSearch}
 *   onClear={handleClear}
 * />
 *
 * @example
 * // 커스텀 버튼 추가
 * <FilterBar
 *   rows={[{ items: [...] }]}
 *   onSearch={handleSearch}
 *   onClear={handleClear}
 *   extraButtons={
 *     <IsButton onClick={handleExport}>엑셀 다운로드</IsButton>
 *   }
 * />
 *
 * @example
 * // 개별 필드 너비 지정
 * <FilterBar
 *   rows={[
 *     {
 *       items: [
 *         { element: <IsInputText label="이름" />, width: 150 },
 *         { element: <IsInputText label="설명" />, width: 300 },
 *       ]
 *     }
 *   ]}
 *   onSearch={handleSearch}
 * />
 */
/** 아이템이 객체 형태인지 확인하는 타입 가드 */
function isItemWithOptions(
  item: FilterBarItem
): item is { element: React.ReactNode; width?: number | string | "auto" } {
  return (
    item !== null &&
    typeof item === "object" &&
    "element" in item
  );
}

export function FilterBar({
  rows,
  onSearch,
  onClear,
  searchButtonText = "검색",
  clearButtonText = "초기화",
  showSearchButton = true,
  showClearButton = true,
  showSearchIcon = true,
  customButtons,
  extraButtons,
  fieldWidth = 200,
  gap = 16,
  className,
}: FilterBarProps) {
  /** 아이템의 너비 계산 */
  const getItemWidth = (item: FilterBarItem): string | null => {
    if (isItemWithOptions(item)) {
      if (item.width === "auto") return null; // auto일 경우 wrapper 없이 렌더링
      if (item.width !== undefined) {
        return typeof item.width === "number" ? `${item.width}px` : item.width;
      }
    }
    // 기본 너비 적용
    return typeof fieldWidth === "number" ? `${fieldWidth}px` : fieldWidth;
  };

  /** 아이템의 element 추출 */
  const getItemElement = (item: FilterBarItem): React.ReactNode => {
    return isItemWithOptions(item) ? item.element : item;
  };

  return (
    <Container className={className}>
      {/* 필터 입력 그룹 */}
      <InputGroup $gap={gap}>
        {rows.map((row, rowIndex) => (
          <Row key={rowIndex} $gap={gap}>
            {row.items.map((item, itemIndex) => {
              const width = getItemWidth(item);
              const element = getItemElement(item);

              // width가 null이면 (auto) wrapper 없이 직접 렌더링
              if (width === null) {
                return <React.Fragment key={itemIndex}>{element}</React.Fragment>;
              }

              return (
                <FieldWrapper key={itemIndex} $width={width}>
                  {element}
                </FieldWrapper>
              );
            })}
          </Row>
        ))}
      </InputGroup>

      {/* 버튼 그룹 */}
      <ButtonGroup>
        {/* 커스텀 버튼 (검색/초기화 앞) */}
        {customButtons}

        {/* 검색 버튼 */}
        {showSearchButton && (
          <IsButton
            variant="solid"
            color="primary"
            size="xs"
            onClick={onSearch}
            leftIconSlot={showSearchIcon ? <SearchIcon /> : undefined}
          >
            {searchButtonText}
          </IsButton>
        )}

        {/* 초기화 버튼 */}
        {showClearButton && (
          <IsButton
            variant="solid"
            color="secondary"
            size="sm"
            onClick={onClear}
          >
            {clearButtonText}
          </IsButton>
        )}

        {/* 추가 버튼 (검색/초기화 뒤) */}
        {extraButtons}
      </ButtonGroup>
    </Container>
  );
}

/* ========================================
   스타일 정의
   ======================================== */

/** 메인 컨테이너 - Figma 기준: padding 17px, gap 16px, border-radius 12px */
const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 17px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(112, 115, 124, 0.22);
  box-sizing: border-box;
`;

/** 필터 입력 그룹 */
const InputGroup = styled.div<{ $gap: number }>`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap}px;
  min-width: 0;
`;

/** 필터 행 */
const Row = styled.div<{ $gap: number }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ $gap }) => $gap}px;
`;

/** 필터 필드 래퍼 */
const FieldWrapper = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  flex-shrink: 0;
`;

/** 버튼 그룹 - Figma 기준: gap 4px */
const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  gap: 4px;
  flex-shrink: 0;
`;

export default FilterBar;
