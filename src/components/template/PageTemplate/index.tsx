/**
 * PageTemplate 컴포넌트
 * @description 페이지의 공통 레이아웃을 제공하는 템플릿 컴포넌트
 * - 브라우저 탭 타이틀 설정
 * - 상단 네비게이션 헤더 (페이지 타이틀)
 * - 메인 컨텐츠 영역
 */
import React from "react";
import styled from "styled-components";

/* ========================================
   타입 정의
   ======================================== */

export interface PageTemplateProps {
  /** 페이지 타이틀 (브라우저 탭 & 헤더에 표시) */
  title: string;
  /** 페이지 컨텐츠 */
  children: React.ReactNode;
  /** 헤더 오른쪽에 표시할 추가 요소 (예: 액션 버튼) */
  headerRight?: React.ReactNode;
  /** 컨테이너 className */
  className?: string;
  /** 메인 컨테이너에 추가 패딩 적용 여부 (기본: true) */
  hasPadding?: boolean;
  /** 메인 컨테이너에 gap 적용 여부 (기본: true) */
  hasGap?: boolean;
  /** 페이지 배경색 (기본: rgba(112, 115, 124, 0.16)) */
  backgroundColor?: string;
}

/* ========================================
   메인 컴포넌트
   ======================================== */

/**
 * PageTemplate - 페이지 레이아웃 템플릿
 *
 * @description
 * 모든 페이지에서 공통으로 사용되는 레이아웃 구조를 제공합니다.
 * - 브라우저 탭에 페이지 타이틀 표시
 * - 상단 네비게이션 헤더에 페이지 타이틀 표시
 * - 메인 컨텐츠 영역에 children 렌더링
 *
 * @example
 * // 기본 사용법
 * <PageTemplate title="사용자 관리">
 *   <PageHeader title="사용자 관리" onAdd={...} onSave={...} />
 *   <FilterBar ... />
 *   <Grid ... />
 * </PageTemplate>
 *
 * @example
 * // 헤더 오른쪽에 액션 버튼 추가
 * <PageTemplate
 *   title="파일 관리"
 *   headerRight={<IsButton onClick={...}>업로드</IsButton>}
 * >
 *   ...
 * </PageTemplate>
 */
export function PageTemplate({
  title,
  children,
  headerRight,
  className,
  hasPadding = true,
  hasGap = true,
  backgroundColor,
}: PageTemplateProps) {
  return (
    <PageContainer className={className} $backgroundColor={backgroundColor}>
      {/* 브라우저 탭 타이틀 */}
      <title>{title}</title>

      {/* 상단 네비게이션 헤더 */}
      <PageHeaderBar>
        <PageTitle>{title}</PageTitle>
        {headerRight && <HeaderRightSection>{headerRight}</HeaderRightSection>}
      </PageHeaderBar>

      {/* 메인 컨텐츠 영역 */}
      <MainContainer $hasPadding={hasPadding} $hasGap={hasGap}>
        {children}
      </MainContainer>
    </PageContainer>
  );
}

/* ========================================
   스타일 정의
   ======================================== */

/** 페이지 최상위 컨테이너 */
const PageContainer = styled.div<{ $backgroundColor?: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${({ $backgroundColor }) =>
    $backgroundColor ?? "rgba(112, 115, 124, 0.16)"};
`;

/** 상단 네비게이션 헤더 바 */
const PageHeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  background: #f7f7f8;
  border-bottom: 1px solid rgba(112, 115, 124, 0.22);
  flex-shrink: 0;
`;

/** 페이지 제목 */
const PageTitle = styled.h1`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.467;
  letter-spacing: 0.144px;
  color: #1b2a6b;
  margin: 0;
`;

/** 헤더 오른쪽 섹션 */
const HeaderRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/** 메인 컨텐츠 영역 */
const MainContainer = styled.main<{ $hasPadding: boolean; $hasGap: boolean }>`
  flex: 1;
  overflow: hidden;
  padding: ${({ $hasPadding }) => ($hasPadding ? "24px" : "0")};
  display: flex;
  flex-direction: column;
  gap: ${({ $hasGap }) => ($hasGap ? "16px" : "0")};
  min-height: 0;
`;

export default PageTemplate;
