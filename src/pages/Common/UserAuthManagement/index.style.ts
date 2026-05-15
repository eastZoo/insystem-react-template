/**
 * 사용자 권한관리 페이지 스타일
 */
import styled from "styled-components";

/* ========================================
   듀얼 패널 레이아웃
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

/* ========================================
   탭 영역
   ======================================== */

/** 탭 바 컨테이너 */
export const TabBar = styled.div`
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(112, 115, 124, 0.22);
`;

/* ========================================
   패널 컨테이너
   ======================================== */

/** 패널 컨테이너 */
export const PanelContainer = styled.div<{ $tabCount?: number; $activeTabIndex?: number }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 8px;
  gap: 8px;
  background: #ffffff;
  border-radius: ${({ $tabCount, $activeTabIndex }) => {
    if ($tabCount === 1) return "8px 0 8px 8px";
    if ($activeTabIndex === 0) return "0 8px 8px 8px";
    if ($activeTabIndex === ($tabCount ?? 1) - 1) return "8px 0 8px 8px";
    return "0 0 8px 8px";
  }};
  overflow: hidden;
`;

/** 패널 헤더 */
export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  flex-shrink: 0;
`;

/** 패널 제목 */
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/** 삭제 버튼 */
export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  border-radius: 6px;
  color: #ff3b30;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 59, 48, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/** 그리드 컨텐츠 영역 */
export const GridContent = styled.div`
  flex: 1;
  overflow: hidden;
  min-height: 0;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 8px;
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
   사용자 검색 팝업 스타일
   ======================================== */

/** 팝업 오버레이 */
export const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

/** 팝업 컨테이너 */
export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 900px;
  max-width: 90vw;
  max-height: 80vh;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
`;

/** 팝업 헤더 */
export const PopupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid rgba(112, 115, 124, 0.12);
`;

/** 팝업 제목 */
export const PopupTitle = styled.h3`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #171719;
  margin: 0;
`;

/** 팝업 닫기 버튼 */
export const PopupCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #70737c;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(112, 115, 124, 0.12);
    color: #171719;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

/** 팝업 본문 */
export const PopupBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px 20px;
  gap: 16px;
  overflow: hidden;
`;

/** 팝업 검색 영역 */
export const PopupSearchArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
`;

/** 팝업 검색 필드 */
export const PopupSearchField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;

  label {
    font-family: "Pretendard Variable", "Pretendard", sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: rgba(46, 47, 51, 0.88);
  }
`;

/** 팝업 검색 버튼 */
export const PopupSearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  background: #3182f6;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #2272eb;
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

/** 팝업 그리드 영역 */
export const PopupGridArea = styled.div`
  flex: 1;
  min-height: 300px;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 8px;
  overflow: hidden;
`;

/** 팝업 푸터 */
export const PopupFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid rgba(112, 115, 124, 0.12);
`;

/** 팝업 버튼 */
export const PopupButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 20px;
  background: ${({ $primary }) => ($primary ? "#2ec4a0" : "#ffffff")};
  border: 1px solid ${({ $primary }) => ($primary ? "#2ec4a0" : "rgba(112, 115, 124, 0.22)")};
  border-radius: 6px;
  color: ${({ $primary }) => ($primary ? "#ffffff" : "#70737c")};
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#26a88a" : "#f8f9fa")};
    border-color: ${({ $primary }) => ($primary ? "#26a88a" : "rgba(112, 115, 124, 0.32)")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/** 사용자 수 카운트 */
export const UserCount = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  color: rgba(46, 47, 51, 0.6);
`;

/** 현재 그룹 표시 */
export const CurrentGroupBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: rgba(255, 149, 0, 0.12);
  border-radius: 4px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #ff9500;
`;
