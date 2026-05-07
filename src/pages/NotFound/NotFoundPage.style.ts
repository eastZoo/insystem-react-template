/**
 * 404 페이지 스타일
 * @description 로그인 페이지 테마와 일관된 디자인
 */
import styled from "styled-components";

/* ========================================
   메인 레이아웃
   ======================================== */

/** 전체 컨테이너 - 어두운 그라디언트 배경 */
export const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
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

/** 컨텐츠 영역 */
export const NotFoundContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;
  padding: 48px;
  position: relative;
  z-index: 1;
`;

/* ========================================
   404 아이콘 영역
   ======================================== */

/** 404 아이콘 */
export const NotFoundIcon = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(20, 200, 165, 0.15);
  border: 2px solid rgba(20, 200, 165, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;

  &::before {
    content: "404";
    font-family: "Pretendard Variable", "Pretendard", sans-serif;
    font-size: 42px;
    font-weight: 700;
    color: #14c8a5;
    letter-spacing: -2px;
  }

  /* 외곽 글로우 효과 */
  box-shadow: 0 0 60px rgba(20, 200, 165, 0.2),
    inset 0 0 30px rgba(20, 200, 165, 0.05);
`;

/* ========================================
   텍스트 영역
   ======================================== */

/** 제목 */
export const NotFoundTitle = styled.h1`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  line-height: 1.3;
`;

/** 설명 텍스트 */
export const NotFoundDescription = styled.p`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #989ba2;
  margin: 0 0 40px 0;
  line-height: 1.6;
  letter-spacing: 0.1px;
`;

/* ========================================
   버튼 영역
   ======================================== */

/** 버튼 그룹 */
export const NotFoundActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

/** 홈으로 가기 버튼 (Primary) */
export const HomeButton = styled.button`
  padding: 14px 32px;
  border-radius: 8px;
  border: none;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: #14c8a5;
  color: #0f1823;
  transition: all 0.2s ease;
  letter-spacing: -0.2px;

  &:hover {
    background: #11b494;
    transform: translateY(-2px);
    box-shadow: 0px 8px 24px rgba(20, 200, 165, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

/** 이전 페이지 버튼 (Secondary) */
export const BackButton = styled.button`
  padding: 14px 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  transition: all 0.2s ease;
  letter-spacing: -0.2px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
