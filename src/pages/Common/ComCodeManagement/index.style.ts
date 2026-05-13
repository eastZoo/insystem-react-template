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
  padding: 17px;
  background: #ffffff;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 12px;
  min-height: 0;
  overflow: hidden;
`;

/** 패널 헤더 */
export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-shrink: 0;
`;

/** 패널 제목 */
export const PanelTitle = styled.h3`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.429;
  color: #1b2a6b;
  margin: 0;
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

/** 그리드 컨텐츠 영역 */
export const GridContent = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;
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
