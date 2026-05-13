/**
 * 페이지네이션 컴포넌트
 * @description 목록 데이터의 페이지 이동을 위한 컴포넌트
 */
import { useMemo, useCallback } from "react";
import styled from "styled-components";

/* ========================================
   타입 정의
   ======================================== */

interface PaginationBaseProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void;
  /** 표시할 페이지 버튼 개수 (기본값: 5) */
  visiblePages?: number;
}

interface PaginationWithTotalItems extends PaginationBaseProps {
  /** 전체 아이템 개수 */
  totalItems: number;
  /** 페이지당 아이템 개수 */
  itemsPerPage: number;
  totalPages?: never;
}

interface PaginationWithTotalPages extends PaginationBaseProps {
  /** 전체 페이지 수 (직접 전달) */
  totalPages: number;
  totalItems?: never;
  itemsPerPage?: never;
}

type PaginationProps = PaginationWithTotalItems | PaginationWithTotalPages;

/* ========================================
   아이콘 컴포넌트
   ======================================== */

/** 이전 화살표 아이콘 */
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 12L6 8L10 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 다음 화살표 아이콘 */
const ChevronRightIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 4L10 8L6 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 처음으로 아이콘 */
const ChevronFirstIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11 12L7 8L11 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 4V12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/** 마지막으로 아이콘 */
const ChevronLastIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 4L9 8L5 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 4V12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* ========================================
   스타일 컴포넌트
   ======================================== */

/** 페이지네이션 컨테이너 */
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

/** 페이지 버튼 */
const PageButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "#0066ff" : "rgba(112, 115, 124, 0.22)"};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#0066ff" : "#ffffff")};
  color: ${({ $active }) =>
    $active ? "#ffffff" : "rgba(46, 47, 51, 0.88)"};
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.385;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ $active }) =>
      $active ? "#0052cc" : "rgba(112, 115, 124, 0.08)"};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/** 네비게이션 버튼 (이전/다음) */
const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 6px;
  background: #ffffff;
  color: rgba(46, 47, 51, 0.88);
  cursor: pointer;
  transition: all 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover:not(:disabled) {
    background: rgba(112, 115, 124, 0.08);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/** 줄임표 */
const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  color: rgba(55, 56, 60, 0.61);
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
`;

/* ========================================
   메인 컴포넌트
   ======================================== */

/**
 * 페이지네이션 컴포넌트
 */
export function Pagination(props: PaginationProps) {
  const {
    currentPage,
    onPageChange,
    visiblePages = 5,
  } = props;

  /** 전체 페이지 수 계산 */
  const totalPages = useMemo(() => {
    if ("totalPages" in props && props.totalPages !== undefined) {
      return props.totalPages;
    }
    if ("totalItems" in props && "itemsPerPage" in props) {
      return Math.ceil(props.totalItems / props.itemsPerPage);
    }
    return 1;
  }, [props]);

  /** 표시할 페이지 번호 배열 생성 */
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

    if (totalPages <= visiblePages + 2) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 항상 첫 페이지 표시
      pages.push(1);

      // 현재 페이지 기준으로 표시할 범위 계산
      const halfVisible = Math.floor(visiblePages / 2);
      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      // 범위 조정
      if (currentPage <= halfVisible + 1) {
        endPage = Math.min(totalPages - 1, visiblePages);
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = Math.max(2, totalPages - visiblePages + 1);
      }

      // 시작 줄임표
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }

      // 중간 페이지들
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 끝 줄임표
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // 항상 마지막 페이지 표시
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, visiblePages]);

  /** 페이지 이동 핸들러 */
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  // 페이지가 1개 이하면 표시 안 함
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Container>
      {/* 처음으로 버튼 */}
      <NavButton
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        title="처음"
      >
        <ChevronFirstIcon />
      </NavButton>

      {/* 이전 버튼 */}
      <NavButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="이전"
      >
        <ChevronLeftIcon />
      </NavButton>

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return <Ellipsis key={page}>...</Ellipsis>;
        }
        return (
          <PageButton
            key={index}
            $active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PageButton>
        );
      })}

      {/* 다음 버튼 */}
      <NavButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="다음"
      >
        <ChevronRightIcon />
      </NavButton>

      {/* 마지막으로 버튼 */}
      <NavButton
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="마지막"
      >
        <ChevronLastIcon />
      </NavButton>
    </Container>
  );
}

export default Pagination;
