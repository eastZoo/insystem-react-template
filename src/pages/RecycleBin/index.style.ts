/**
 * 휴지통 페이지 스타일
 * @description 휴지통 페이지의 styled-components 정의
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

/* ========================================
   휴지통 비우기 버튼
   ======================================== */

/** 휴지통 비우기 버튼 */
export const EmptyTrashButton = styled(IsButton)`
  /* 기본 스타일 유지 */
`;

/* ========================================
   상태 카드 영역
   ======================================== */

/** 상태 카드 그리드 */
export const StatusCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
`;

/** 상태 카드 */
export const StatusCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 21px;
  background: #ffffff;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 12px;
`;

/** 카드 아이콘 타입 */
type CardIconColor = "red" | "orange" | "gray";

/** 카드 아이콘 래퍼 */
export const CardIconWrap = styled.div<{ $color: CardIconColor }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;

  ${({ $color }) => {
    switch ($color) {
      case "red":
        return `
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
        `;
      case "orange":
        return `
          background: rgba(255, 146, 0, 0.12);
          color: #ff9200;
        `;
      default:
        return `
          background: rgba(112, 115, 124, 0.08);
          color: #70737c;
        `;
    }
  }}
`;

/** 카드 텍스트 그룹 */
export const CardTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/** 카드 숫자 */
export const CardNumber = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.364;
  letter-spacing: -0.427px;
  color: #171719;
`;

/** 카드 라벨 */
export const CardLabel = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: rgba(55, 56, 60, 0.61);
`;

/* ========================================
   테이블 컨테이너 영역
   ======================================== */

/** 테이블 컨테이너 */
export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
  padding: 17px;
  background: #ffffff;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 12px;
  min-height: 0;
  overflow: hidden;
`;

/** 테이블 컨텐츠 영역 (스크롤 가능) */
export const TableContent = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;
`;

/** 페이지네이션 푸터 */
export const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid rgba(112, 115, 124, 0.12);
  flex-shrink: 0;
`;

/** 검색 바 (툴바 영역) */
export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  flex-shrink: 0;
`;

/** 검색 바 좌측 (검색 입력 + 필터) */
export const SearchLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/** 검색 입력 래퍼 */
export const SearchInputWrapper = styled.div`
  width: 200px;

  /* IsInputSearch FieldShell(실제 입력 박스)만 타겟팅 */
  /* SearchInputWrapper > Root > InputStack > FieldShell */
  & > div > div > div:first-child {
    background: rgba(112, 115, 124, 0.08);
    border: 1px solid rgba(112, 115, 124, 0.22);
  }
`;

/** 셀렉트 래퍼 */
export const SelectWrapper = styled.div`
  width: 120px;

  /* IsSelect 트리거 버튼만 타겟팅 (드롭다운 옵션 버튼은 제외) */
  & button[aria-haspopup="listbox"] {
    background: rgba(112, 115, 124, 0.08);
    border: 1px solid rgba(112, 115, 124, 0.22);
  }
`;

/** 검색 바 우측 (뷰 토글) */
export const SearchRight = styled.div`
  display: flex;
  align-items: center;
`;

/** 뷰 모드 토글 버튼 그룹 */
export const ViewToggle = styled.div`
  display: flex;
  align-items: center;
`;

/** 뷰 모드 버튼 위치 타입 */
type ViewButtonPosition = "left" | "right";

/** 뷰 모드 토글 버튼 */
export const ViewButton = styled.button<{
  $active: boolean;
  $position: ViewButtonPosition;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 8px;
  border: 1px solid rgba(112, 115, 124, 0.12);
  background: ${({ $active }) =>
    $active ? "rgba(112, 115, 124, 0.16)" : "#ffffff"};
  cursor: pointer;
  color: #70737c;
  transition: background 0.15s ease;

  ${({ $position }) =>
    $position === "left"
      ? `
    border-radius: 8px 0 0 8px;
    border-right: none;
  `
      : `
    border-radius: 0 8px 8px 0;
  `}

  &:hover {
    background: rgba(112, 115, 124, 0.08);
  }
`;

/** 빈 상태 영역 */
export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
`;

/** 빈 상태 아이콘 */
export const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  color: #a0aabf;

  svg {
    width: 100%;
    height: 100%;
  }
`;

/** 빈 상태 텍스트 그룹 */
export const EmptyStateTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

/** 빈 상태 제목 */
export const EmptyStateTitle = styled.h3`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: #171719;
  margin: 0;
`;

/** 빈 상태 설명 */
export const EmptyStateDescription = styled.p`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.429;
  color: rgba(55, 56, 60, 0.61);
  margin: 0;
  text-align: center;
`;

/* ========================================
   선택 액션 바
   ======================================== */

/** 선택 액션 바 컨테이너 */
export const SelectionActionBar = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  flex-shrink: 0;
`;

/** 액션 바 아이템 */
export const ActionBarItem = styled.div<{ $hasBorder?: boolean }>`
  display: flex;
  align-items: center;
  align-self: stretch;
  padding: 0 8px;
  border-right: ${({ $hasBorder }) =>
    $hasBorder ? "1px solid #e1e2e4" : "none"};
`;

/** 선택 개수 표시 */
export const SelectionCount = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  line-height: 1.334;
  letter-spacing: 0.302px;
`;

/** 선택 개수 숫자 */
export const SelectionCountNumber = styled.span`
  font-weight: 600;
  color: rgba(46, 47, 51, 0.88);
`;

/** 선택 개수 텍스트 */
export const SelectionCountText = styled.span`
  font-weight: 500;
  color: rgba(55, 56, 60, 0.61);
`;

/** 액션 버튼 */
export const ActionButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 4px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: ${({ $danger }) => ($danger ? "#ff4242" : "rgba(55, 56, 60, 0.61)")};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $danger }) =>
      $danger ? "rgba(255, 66, 66, 0.08)" : "rgba(112, 115, 124, 0.08)"};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ========================================
   파일 목록 (Alert 모달용)
   ======================================== */

/** 파일 목록 컨테이너 */
export const FileListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 187px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 8px;
  overflow-y: auto;
`;

/** 파일 아이템 */
export const FileListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
`;

/** 파일 아이콘 */
export const FileListIcon = styled.div`
  display: flex;
  align-items: center;
  padding-top: 2px;
  color: #70737c;

  svg {
    width: 16px;
    height: 16px;
  }
`;

/** 파일 이름 */
export const FileListName = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: #1b2a6b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
