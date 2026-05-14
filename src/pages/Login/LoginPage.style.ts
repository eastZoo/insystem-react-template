/**
 * 로그인 페이지 스타일
 * @description Figma 디자인 기반 분할 화면 레이아웃 스타일 정의
 */
import styled from "styled-components";

/* ========================================
   메인 레이아웃
   ======================================== */

/** 전체 컨테이너 - 분할 화면 레이아웃 */
export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
`;

/* ========================================
   왼쪽 패널 (브랜드 영역)
   ======================================== */

/** 왼쪽 패널 - 어두운 그라디언트 배경 */
export const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 56px;
  background: linear-gradient(
    136.6deg,
    rgb(17, 28, 78) 0%,
    rgb(15, 24, 35) 100%
  );
  position: relative;
  overflow: hidden;

  /* 그라디언트 오버레이 효과 */
  &::before {
    content: "";
    position: absolute;
    width: 800px;
    height: 600px;
    left: -200px;
    top: 100px;
    background: radial-gradient(
      circle,
      rgba(20, 200, 165, 0.12) 0%,
      rgba(20, 200, 165, 0) 45%
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    width: 870px;
    height: 823px;
    right: -200px;
    bottom: -100px;
    background: radial-gradient(
      circle,
      rgba(20, 200, 165, 0.08) 0%,
      rgba(20, 200, 165, 0) 50%
    );
    pointer-events: none;
  }
`;

/** 로고 컨테이너 */
export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
`;

/** 로고 아이콘 */
export const LogoIcon = styled.div`
  width: 24px;
  height: 30px;
  color: #14c8a5;

  svg {
    width: 100%;
    height: 100%;
  }
`;

/** 로고 텍스트 */
export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

/** 로고 상단 텍스트 (Vectra) */
export const LogoTextTop = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: white;
  letter-spacing: 0.5px;
`;

/** 로고 하단 텍스트 (Secure) */
export const LogoTextBottom = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: #14c8a5;
  letter-spacing: 0.5px;
`;

/* ========================================
   메인 컨텐츠 영역
   ======================================== */

/** 메인 컨텐츠 컨테이너 */
export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
`;

/** 헤드라인 컨테이너 */
export const HeadlineContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

/** 메인 헤드라인 */
export const Headline = styled.h1`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.375;
  letter-spacing: -1.012px;
  color: white;
  margin: 0;

  .accent {
    color: #14c8a5;
  }
`;

/** 설명 텍스트 컨테이너 */
export const DescriptionContainer = styled.div`
  max-width: 440px;
`;

/** 설명 텍스트 */
export const Description = styled.p`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.467;
  letter-spacing: 0.144px;
  color: #989ba2;
  margin: 0;
`;

/* ========================================
   기능 목록 영역
   ======================================== */

/** 기능 목록 컨테이너 */
export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/** 기능 아이템 */
export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

/** 기능 아이콘 박스 */
export const FeatureIconBox = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 200, 165, 0.15);
  border-radius: 6px;
  flex-shrink: 0;
`;

/** 기능 아이콘 */
export const FeatureIcon = styled.div`
  width: 16px;
  height: 16px;
  color: #14c8a5;

  svg {
    width: 100%;
    height: 100%;
  }
`;

/** 기능 텍스트 */
export const FeatureText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.14px;
  color: #989ba2;
`;

/* ========================================
   푸터 영역
   ======================================== */

/** 푸터 컨테이너 */
export const Footer = styled.div`
  position: relative;
  z-index: 1;
`;

/** 푸터 텍스트 */
export const FooterText = styled.p`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.273;
  letter-spacing: 0.342px;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;

  .highlight {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.55);
  }
`;

/* ========================================
   오른쪽 패널 (로그인 폼 영역)
   ======================================== */

/** 오른쪽 패널 - 흰색 배경 */
export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 48px;
`;

/** 폼 컨테이너 */
export const FormContainer = styled.div`
  width: 100%;
  max-width: 485px;
`;

/** 타이틀 영역 */
export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`;

/** LOGIN 라벨 */
export const LoginLabel = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: ${({ theme }) => theme.semantic?.primary?.normal};
`;

/** 로그인 제목 */
export const LoginTitle = styled.h2`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 32px;
  font-weight: 500;
  line-height: 1.375;
  letter-spacing: -0.81px;
  color: rgba(46, 47, 51, 0.88);
  margin: 0;
`;

/** 폼 영역 */
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/** 로그인 버튼 스타일 오버라이드 */
export const LoginButtonWrapper = styled.div`
  margin-top: 8px;
`;

/* ========================================
   안내 텍스트 영역
   ======================================== */

/** 안내 텍스트 컨테이너 */
export const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;

/** 안내 아이콘 */
export const InfoIcon = styled.div`
  width: 16px;
  height: 16px;
  color: rgba(55, 56, 60, 0.61);
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

/** 안내 텍스트 */
export const InfoText = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.385;
  letter-spacing: 0.252px;
  color: rgba(55, 56, 60, 0.61);

  .highlight {
    font-weight: 600;
    color: #0f1945;
    text-decoration: underline;
  }
`;

/* ========================================
   에러 메시지
   ======================================== */

/** 에러 메시지 */
export const ErrorMessage = styled.div`
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
  padding: 10px 14px;
  font-size: 13px;
  text-align: center;
  border-radius: 8px;
  background: rgba(220, 53, 69, 0.08);
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* ========================================
   테스트 계정 (임시)
   ======================================== */

/** 테스트 계정 섹션 래퍼 */
export const TestAccountSection = styled.div`
  margin-top: 20px;
  padding: 14px 16px;
  background: rgba(15, 25, 69, 0.04);
  border: 1px dashed rgba(15, 25, 69, 0.2);
  border-radius: 8px;
`;

/** 테스트 계정 레이블 */
export const TestAccountLabel = styled.div`
  font-size: 11px;
  color: #888;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
  }
`;

/** 테스트 계정 버튼 목록 */
export const TestAccountList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

/** 테스트 계정 버튼 */
export const TestAccountButton = styled.button`
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #0f1945;
  background: white;
  border: 1px solid rgba(15, 25, 69, 0.25);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;

  &:hover {
    background: #0f1945;
    color: white;
    border-color: #0f1945;
  }

  &:active {
    transform: scale(0.97);
  }
`;

/* ========================================
   반응형 스타일
   ======================================== */
