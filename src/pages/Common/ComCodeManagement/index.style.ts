/**
 * 공통코드 관리 페이지 스타일
 */
import styled from "styled-components";
import { IsButton } from "insystem-atoms";

/* ========================================
   페이지 레이아웃
   ======================================== */

/** 페이지 최상위 컨테이너 */
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(112, 115, 124, 0.16);
`;

/** 페이지 상단 헤더 */
export const PageHeader = styled.header`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px;
  background: #f7f7f8;
  border-bottom: 1px solid rgba(112, 115, 124, 0.22);
  flex-shrink: 0;
`;

/** 페이지 제목 */
export const PageTitle = styled.h1`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.467;
  letter-spacing: 0.144px;
  color: #1b2a6b;
  margin: 0;
`;

/** 메인 컨텐츠 영역 */
export const MainContainer = styled.main`
  flex: 1;
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

/** 컨텐츠 래퍼 */
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;
`;

/* ========================================
   컨텐츠 헤더 영역
   ======================================== */

/** 컨텐츠 헤더 (제목 + 버튼) */
export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/** 헤더 텍스트 그룹 */
export const HeaderTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

/** 메인 제목 */
export const MainTitle = styled.h2`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.24px;
  color: #1b2a6b;
  margin: 0;
`;

/** 설명 텍스트 */
export const Description = styled.p`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: #6b7a9f;
  margin: 0;
`;

/** 저장 버튼 */
export const SaveButton = styled(IsButton)`
  box-shadow: 0px 0px 10px 0px rgba(46, 182, 170, 0.25);
`;

/* ========================================
   그리드 컨테이너 영역
   ======================================== */

/** 듀얼 그리드 컨테이너 */
export const DualGridContainer = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
`;

/** 그리드 패널 */
export const GridPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;

/** 탭 바 컨테이너 */
export const TabBar = styled.div`
  display: flex;
  flex-shrink: 0;
`;

/** 탭 아이템 - Figma 332:9294 (선택됨), 332:9295 (선택 안됨) 기준 */
export const TabItem = styled.button<{ $active?: boolean; $position?: "start" | "center" | "end" | "single" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  min-width: 140px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  line-height: 1.429;
  letter-spacing: 0.203px;
  white-space: nowrap;

  /* 선택 상태에 따른 스타일 */
  background: ${({ $active }) => ($active ? "#ffffff" : "rgba(255, 255, 255, 0.5)")};
  color: ${({ $active }) => ($active ? "#171719" : "rgba(55, 56, 60, 0.28)")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};

  /* 테두리 */
  border-bottom: 1px solid rgba(112, 115, 124, 0.08);
  border-right: 1px solid rgba(112, 115, 124, 0.08);

  /* 위치에 따른 border-radius */
  border-radius: ${({ $position }) => {
    switch ($position) {
      case "start":
        return "8px 0 0 0";
      case "end":
        return "0 8px 0 0";
      case "single":
        return "8px 8px 0 0";
      default:
        return "0";
    }
  }};

  &:hover {
    background: ${({ $active }) => ($active ? "#ffffff" : "rgba(255, 255, 255, 0.7)")};
    color: ${({ $active }) => ($active ? "#171719" : "rgba(55, 56, 60, 0.5)")};
  }

  &:focus {
    outline: none;
  }
`;

/** 패널 컨테이너 (탭 아래 컨텐츠 영역) - Figma 기준 */
export const PanelContainer = styled.div<{ $activeTab?: string }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 8px;
  gap: 8px;
  background: #ffffff;
  border-radius: ${({ $activeTab }) =>
    $activeTab === "subCode"
      ? "8px 0 8px 8px"
      : "0 8px 8px 8px"};
  overflow: hidden;
`;

/** 패널 헤더 - Figma Total 영역 기준 */
export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  flex-shrink: 0;
`;

/** 패널 제목 - Figma 기준: Caption 1 */
export const PanelTitle = styled.div`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.334;
  letter-spacing: 0.3024px;
  color: rgba(46, 47, 51, 0.88);
  margin: 0;

  strong {
    font-weight: 600;
  }
`;

/** 패널 액션 버튼 그룹 */
export const PanelActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/** 추가 버튼 */
export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  background: #2ec4a0;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #26a88a;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/** 그리드 컨텐츠 영역 - Figma Content 영역 기준 */
export const GridContent = styled.div`
  flex: 1;
  overflow: hidden;
  min-height: 0;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 8px;
`;

/** 삭제 버튼 (휴지통 아이콘) */
export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #70737c;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/** 빈 상태 메시지 */
export const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  color: #a0aabf;
`;

/** 선택 안내 메시지 */
export const SelectGuideMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  color: #a0aabf;

  svg {
    width: 48px;
    height: 48px;
    opacity: 0.5;
  }

  span {
    font-size: 14px;
  }
`;

/* ========================================
   상세 정보 폼 스타일
   ======================================== */

/* ========================================
   폼 테이블 영역 (UserManagement 스타일)
   ======================================== */

/** 폼 테이블 컨테이너 */
export const FormTable = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px;
  flex: 1;
  overflow: auto;
`;

/** 폼 테이블 컬럼 */
export const FormTableColumn = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(160, 170, 191, 0.08);
`;

/** 폼 테이블 행 */
export const FormTableRow = styled.div<{ $isFirst?: boolean; $isLast?: boolean }>`
  display: flex;
  align-items: stretch;
  min-height: ${({ $isFirst, $isLast }) =>
    $isFirst || $isLast ? "34px" : "40px"};
  border-bottom: 1px solid rgba(160, 170, 191, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

/** 폼 테이블 라벨 셀 */
export const FormTableLabel = styled.div<{ $required?: boolean }>`
  display: flex;
  align-items: center;
  width: 100px;
  padding: 0 12px;
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

/** 폼 테이블 입력 셀 */
export const FormTableCell = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
`;

/** 레거시 호환용 (삭제 예정) */
export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  overflow: auto;
`;

export const FormRow = styled.div<{ $isFirst?: boolean; $isLast?: boolean }>`
  display: flex;
  align-items: stretch;
  border-top: ${({ $isFirst }) =>
    $isFirst ? "1px solid rgba(112, 115, 124, 0.22)" : "none"};
  border-bottom: 1px solid rgba(112, 115, 124, 0.22);
`;

export const FormLabel = styled.div<{ $required?: boolean }>`
  display: flex;
  align-items: center;
  width: 120px;
  min-width: 120px;
  padding: 12px 16px;
  background: #f7f7f8;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #1b2a6b;
  border-right: 1px solid rgba(112, 115, 124, 0.22);
  flex-shrink: 0;

  ${({ $required }) =>
    $required &&
    `
    &::after {
      content: "*";
      color: #ff3b30;
      margin-left: 2px;
    }
  `}
`;

export const FormCell = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 8px 12px;
  min-width: 0;
`;

export const FormValue = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #70737c;
`;

/** 그리드 컨텐츠 영역 - 테두리와 radius 추가 */
export const GridWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  min-height: 0;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 8px;
`;
