/**
 * PageHeader 컴포넌트
 * @description 페이지 상단의 타이틀과 CRUD 버튼 그룹을 포함하는 헤더 컴포넌트
 * - 페이지 타이틀 표시
 * - 추가/저장/삭제 기본 버튼 제공
 * - 커스텀 버튼 추가 가능
 */
import React from "react";
import styled from "styled-components";
import { IsButton } from "insystem-atoms";

/* ========================================
   타입 정의
   ======================================== */

export interface PageHeaderProps {
  /** 페이지 타이틀 */
  title: string;
  /** 추가 버튼 클릭 핸들러 (없으면 버튼 숨김) */
  onAdd?: () => void;
  /** 저장 버튼 클릭 핸들러 (없으면 버튼 숨김) */
  onSave?: () => void;
  /** 삭제 버튼 클릭 핸들러 (없으면 버튼 숨김) */
  onDelete?: () => void;
  /** 추가 버튼 텍스트 (기본: "추가") */
  addButtonText?: string;
  /** 저장 버튼 텍스트 (기본: "저장") */
  saveButtonText?: string;
  /** 삭제 버튼 텍스트 (기본: "삭제") */
  deleteButtonText?: string;
  /** 추가 버튼 비활성화 */
  addDisabled?: boolean;
  /** 저장 버튼 비활성화 */
  saveDisabled?: boolean;
  /** 삭제 버튼 비활성화 */
  deleteDisabled?: boolean;
  /** 기본 버튼 앞에 추가할 커스텀 버튼 */
  leftButtons?: React.ReactNode;
  /** 기본 버튼 뒤에 추가할 커스텀 버튼 */
  rightButtons?: React.ReactNode;
  /** 타이틀 아래 서브 텍스트 */
  subtitle?: string;
  /** 컨테이너 className */
  className?: string;
}

/* ========================================
   메인 컴포넌트
   ======================================== */

/**
 * PageHeader - 페이지 헤더 컴포넌트 (타이틀 + CRUD 버튼)
 *
 * @example
 * // 기본 사용법 (모든 CRUD 버튼)
 * <PageHeader
 *   title="사용자 관리"
 *   onAdd={handleAdd}
 *   onSave={handleSave}
 *   onDelete={handleDelete}
 * />
 *
 * @example
 * // 일부 버튼만 사용
 * <PageHeader
 *   title="조회 페이지"
 *   onDelete={handleDelete}
 * />
 *
 * @example
 * // 커스텀 버튼 추가
 * <PageHeader
 *   title="데이터 관리"
 *   onSave={handleSave}
 *   rightButtons={
 *     <IsButton onClick={handleExport}>엑셀 다운로드</IsButton>
 *   }
 * />
 *
 * @example
 * // 버튼 텍스트 커스터마이징
 * <PageHeader
 *   title="주문 관리"
 *   onAdd={handleAdd}
 *   addButtonText="신규 주문"
 *   onSave={handleSave}
 *   saveButtonText="주문 확정"
 * />
 */
export function PageHeader({
  title,
  onAdd,
  onSave,
  onDelete,
  addButtonText = "추가",
  saveButtonText = "저장",
  deleteButtonText = "삭제",
  addDisabled = false,
  saveDisabled = false,
  deleteDisabled = false,
  leftButtons,
  rightButtons,
  subtitle,
  className,
}: PageHeaderProps) {
  const hasButtons = onAdd || onSave || onDelete || leftButtons || rightButtons;

  return (
    <Container className={className}>
      {/* 타이틀 영역 */}
      <TitleContainer>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleContainer>

      {/* 버튼 그룹 */}
      {hasButtons && (
        <ButtonGroup>
          {/* 커스텀 버튼 (왼쪽) */}
          {leftButtons}

          {/* 추가 버튼 */}
          {onAdd && (
            <IsButton
              variant="solid"
              color="dark"
              size="xs"
              onClick={onAdd}
              disabled={addDisabled}
            >
              {addButtonText}
            </IsButton>
          )}

          {/* 저장 버튼 */}
          {onSave && (
            <IsButton
              variant="solid"
              color="dark"
              size="xs"
              onClick={onSave}
              disabled={saveDisabled}
            >
              {saveButtonText}
            </IsButton>
          )}

          {/* 삭제 버튼 */}
          {onDelete && (
            <IsButton
              variant="solid"
              color="secondary"
              size="xs"
              onClick={onDelete}
              disabled={deleteDisabled}
            >
              {deleteButtonText}
            </IsButton>
          )}

          {/* 커스텀 버튼 (오른쪽) */}
          {rightButtons}
        </ButtonGroup>
      )}
    </Container>
  );
}

/* ========================================
   스타일 정의
   ======================================== */

/** 메인 컨테이너 - Figma ContentHeader 기준 */
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

/** 타이틀 컨테이너 */
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
`;

/** 페이지 타이틀 - Figma Heading 2/Bold */
const Title = styled.h2`
  margin: 0;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.24px;
  color: #1b2a6b;
  white-space: nowrap;
`;

/** 서브타이틀 */
const Subtitle = styled.p`
  margin: 0;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.385;
  letter-spacing: 0.25px;
  color: rgba(55, 56, 60, 0.61);
`;

/** 버튼 그룹 - Figma ButtonGroup 기준: gap 4px */
const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export default PageHeader;
