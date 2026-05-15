/**
 * 사용자 관리 페이지 스타일
 * @description 사용자 관리 페이지의 styled-components 정의
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
  gap: 16px;
  min-height: 0;
`;

/* ========================================
   타이틀 영역
   ======================================== */

/** 타이틀 섹션 */
export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

/** 메인 타이틀 */
export const MainTitle = styled.h2`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.24px;
  color: #1b2a6b;
  margin: 0;
`;

/* ========================================
   검색 필터 영역
   ======================================== */

/** 검색 필터 컨테이너 - 피그마 기준: padding 16px, gap 16px */
export const SearchFilterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  outline: 1px solid rgba(160, 170, 191, 0.22);
  outline-offset: -1px;
  box-sizing: border-box;
`;

/** 필터 입력 그룹 - 피그마 기준: flex: 1, flex-wrap */
export const FilterInputGroup = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  gap: 16px;
`;

/** 필터 필드 래퍼 - 피그마 기준: 총 너비 200px */
export const FilterFieldWrapper = styled.div`
  width: 200px;
  flex-shrink: 0;
`;

/** 검색 버튼 그룹 - 피그마 기준: gap 4px */
export const SearchButtonGroup = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  gap: 4px;
  flex-shrink: 0;
`;

/* ========================================
   메인 컨텐츠 영역 (좌우 분할)
   ======================================== */

/** 컨텐츠 래퍼 */
export const ContentWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
`;

/* ========================================
   좌측 패널 (인사 정보 리스트)
   ======================================== */

/** 좌측 패널 */
export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  background: #ffffff;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 12px;
  flex-shrink: 0;
`;

/** 패널 헤더 */
export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(112, 115, 124, 0.22);
`;

/** 패널 타이틀 */
export const PanelTitle = styled.h3`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: #1b2a6b;
  margin: 0;
`;

/** 카운트 뱃지 */
export const CountBadge = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.385;
  letter-spacing: 0.25px;
  color: #6b7a9f;
`;

/** 리스트 컨테이너 */
export const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

/** 리스트 아이템 */
export const ListItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $selected }) =>
    $selected ? "rgba(46, 182, 170, 0.1)" : "transparent"};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $selected }) =>
      $selected ? "rgba(46, 182, 170, 0.15)" : "rgba(23, 23, 25, 0.05)"};
  }
`;

/** 리스트 아이템 텍스트 */
export const ListItemText = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: rgba(46, 47, 51, 0.88);
`;

/** 패널 푸터 (페이지네이션) */
export const PanelFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-top: 1px solid rgba(112, 115, 124, 0.22);
`;

/* ========================================
   우측 패널 (상세 정보)
   ======================================== */

/** 우측 패널 */
export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #ffffff;
  border: 1px solid rgba(112, 115, 124, 0.22);
  border-radius: 12px;
  min-width: 0;
  overflow: hidden;
`;

/** 탭 바 컨테이너 */
export const TabBar = styled.div`
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(112, 115, 124, 0.22);
`;

/** 탭 컨테이너 (레거시 호환) */
export const TabContainer = styled.div`
  flex-shrink: 0;
`;

/** 탭 컨텐츠 */
export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

/* ========================================
   폼 영역 (전화/이메일/주소 입력 그룹)
   ======================================== */

/** 전화번호 입력 그룹 */
export const PhoneInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

/** 전화번호 구분자 */
export const PhoneSeparator = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(55, 56, 60, 0.61);
`;

/** 이메일 입력 그룹 */
export const EmailInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

/** 이메일 구분자 */
export const EmailSeparator = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(55, 56, 60, 0.61);
`;

/** 주소 입력 그룹 */
export const AddressInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

/** 주소 검색 행 */
export const AddressSearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

/** 주소 검색 버튼 */
export const AddressSearchButton = styled(IsButton)`
  flex-shrink: 0;
`;

/* ========================================
   레거시 폼 영역 (하위 호환)
   ======================================== */

/** 폼 컬럼 래퍼 (2열 레이아웃) */
export const FormColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

/** 폼 컬럼 */
export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/** 폼 필드 그룹 */
export const FormFieldGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

/** 폼 라벨 */
export const FormLabel = styled.label<{ $required?: boolean }>`
  display: flex;
  align-items: center;
  min-width: 100px;
  padding-top: 8px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.429;
  letter-spacing: 0.203px;
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

/** 폼 입력 영역 */
export const FormInputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/** 입력 필드 래퍼 */
export const InputWrapper = styled.div`
  width: 100%;
`;

/** 빈 상태 메시지 */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: #6b7a9f;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
`;
