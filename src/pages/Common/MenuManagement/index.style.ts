/**
 * 메뉴 관리 페이지 스타일
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
export const PanelContainer = styled.div<{ $activeTab?: string }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 8px;
  gap: 8px;
  background: #ffffff;
  border-radius: ${({ $activeTab }) =>
    $activeTab === "detail" ? "0 8px 8px 8px" : "8px 0 8px 8px"};
  overflow: hidden;
`;

/** 패널 헤더 */
export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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

/** 그리드 컨텐츠 영역 */
export const GridContent = styled.div`
  flex: 1;
  overflow: hidden;
  min-height: 0;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 8px;
`;

/** 삭제 버튼 */
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
   Depth 버튼 영역
   ======================================== */

/** Depth 버튼 그룹 */
export const DepthButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
`;

/** Depth 버튼 */
export const DepthButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 26px;
  padding: 0 8px;
  background: ${({ $active }) =>
    $active ? "#2ec4a0" : "rgba(112, 115, 124, 0.08)"};
  border: 1px solid
    ${({ $active }) => ($active ? "#2ec4a0" : "rgba(112, 115, 124, 0.16)")};
  border-radius: 4px;
  color: ${({ $active }) => ($active ? "#ffffff" : "#70737c")};
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#26a88a" : "rgba(112, 115, 124, 0.16)"};
    border-color: ${({ $active }) =>
      $active ? "#26a88a" : "rgba(112, 115, 124, 0.22)"};
  }

  &:focus {
    outline: none;
  }
`;

/* ========================================
   트리 셀 영역
   ======================================== */

/** 트리 셀 컨테이너 */
export const TreeCell = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 4px;
`;

/** 트리 들여쓰기 */
export const TreeIndent = styled.span<{ $depth: number }>`
  width: ${({ $depth }) => ($depth - 1) * 20}px;
  flex-shrink: 0;
`;

/** 트리 토글 버튼 */
export const TreeToggle = styled.button<{ $expanded?: boolean; $hasChildren?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: ${({ $hasChildren }) => ($hasChildren ? "pointer" : "default")};
  transition: all 0.15s ease;
  flex-shrink: 0;
  visibility: ${({ $hasChildren }) => ($hasChildren ? "visible" : "hidden")};

  &:hover {
    background: ${({ $hasChildren }) =>
      $hasChildren ? "rgba(112, 115, 124, 0.12)" : "transparent"};
  }

  svg {
    width: 14px;
    height: 14px;
    color: #70737c;
    transform: ${({ $expanded }) => ($expanded ? "rotate(90deg)" : "rotate(0deg)")};
    transition: transform 0.15s ease;
  }
`;

/** 트리 라벨 */
export const TreeLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
