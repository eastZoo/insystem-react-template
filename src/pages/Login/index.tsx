/**
 * 로그인 페이지
 * @description Figma 디자인 기반 분할 화면 레이아웃 로그인 페이지
 */
import * as S from "./LoginPage.style";
import { useEffect, useState } from "react";
import { useLogin } from "@/lib/hooks/useAuth";
import { isApiSuccess } from "@/types/api";
import { readAccessToken } from "@/lib/functions/authFunctions";
import { useLocation, useNavigate } from "react-router-dom";
import { IsButton, IsInputText } from "insystem-atoms";

/* ========================================
   샘플 계정 상수
   ======================================== */

const SEED_ACCOUNTS = [
  { userId: "admin" },
  { userId: "inadmin" },
  { userId: "intest" },
] as const;

const SEED_PASSWORD = "1";

/* ========================================
   아이콘 컴포넌트
   ======================================== */

/** 로고 아이콘 */
const VectraLogoIcon = () => (
  <svg viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 0L0 6.5V17.5C0 23.5 5.5 29 12 30C18.5 29 24 23.5 24 17.5V6.5L12 0Z"
      fill="currentColor"
    />
    <path
      d="M8 15L11 18L16 12"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 자물쇠 아이콘 (기능 목록용) */
const LockFeatureIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 5.5H4C3.44772 5.5 3 5.94772 3 6.5V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V6.5C13 5.94772 12.5523 5.5 12 5.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 5.5V4C5 3.20435 5.31607 2.44129 5.87868 1.87868C6.44129 1.31607 7.20435 1 8 1C8.79565 1 9.55871 1.31607 10.1213 1.87868C10.6839 2.44129 11 3.20435 11 4V5.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 방패 아이콘 (기능 목록용) */
const ShieldFeatureIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 1.5L2 4V7.5C2 11.25 4.5 14.5 8 15.5C11.5 14.5 14 11.25 14 7.5V4L8 1.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 8L7 9.5L10.5 6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 채팅 아이콘 (기능 목록용) */
const ChatFeatureIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 7.5C14 10.5376 11.3137 13 8 13C7.12049 13 6.28517 12.8304 5.53005 12.5213L2 14L3.11145 10.9689C2.41065 10.0083 2 8.81046 2 7.5C2 4.46243 4.68629 2 8 2C11.3137 2 14 4.46243 14 7.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 사용자 아이콘 (입력 필드용) */
const UserIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 14C13 11.7909 10.7614 10 8 10C5.23858 10 3 11.7909 3 14"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 자물쇠 아이콘 (입력 필드용) */
const LockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 7H4C3.44772 7 3 7.44772 3 8V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V8C13 7.44772 12.5523 7 12 7Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 7V5C5 4.20435 5.31607 3.44129 5.87868 2.87868C6.44129 2.31607 7.20435 2 8 2C8.79565 2 9.55871 2.31607 10.1213 2.87868C10.6839 3.44129 11 4.20435 11 5V7"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 정보 아이콘 */
const InfoCircleIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M8 11V7.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="8" cy="5.5" r="0.75" fill="currentColor" />
  </svg>
);

/* ========================================
   메인 컴포넌트
   ======================================== */

/**
 * 로그인 페이지 컴포넌트
 * @returns 로그인 페이지 JSX
 */
export default function LoginPage() {
  /* ----------------------------------------
     상태 관리
     ---------------------------------------- */
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  /** 아이디 입력 상태 */
  const [userId, setUserId] = useState<string>(SEED_ACCOUNTS[0].userId);
  /** 비밀번호 입력 상태 */
  const [password, setPassword] = useState<string>(SEED_PASSWORD);
  /** 에러 메시지 상태 */
  const [errorMessage, setErrorMessage] = useState("");

  /** 리디렉트 경로 추출 */
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/";

  /**
   * 안전한 앱 경로 검증
   * @param pathname 경로
   * @returns 검증된 경로
   */
  function safeAppPath(pathname: string): string {
    if (!pathname.startsWith("/") || pathname.startsWith("//")) return "/";
    return pathname;
  }

  /* ----------------------------------------
     사이드 이펙트
     ---------------------------------------- */

  /** 이미 로그인된 경우 리디렉트 */
  useEffect(() => {
    if (readAccessToken()) {
      navigate(safeAppPath(from), { replace: true });
    }
  }, [from, navigate]);

  /* ----------------------------------------
     이벤트 핸들러
     ---------------------------------------- */

  /**
   * 로그인 제출 핸들러
   * @param e 폼 제출 이벤트
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await loginMutation.mutateAsync({
        userId,
        password,
      });

      if (!isApiSuccess(res) || !readAccessToken()) {
        setErrorMessage(res.message ?? "로그인에 실패했습니다.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(safeAppPath(from), { replace: true });
    } catch {
      setErrorMessage("로그인 중 오류가 발생했습니다.");
    }
  };

  /* ========================================
     렌더링
     ======================================== */

  return (
    <>
      <title>로그인</title>
      <S.Container>
        {/* 왼쪽 패널 - 브랜드 영역 */}
        <S.LeftPanel>
          {/* 로고 */}
          <S.LogoContainer>
            <S.LogoIcon>
              <VectraLogoIcon />
            </S.LogoIcon>
            <S.LogoText>
              <S.LogoTextTop>Vectra</S.LogoTextTop>
              <S.LogoTextBottom>Secure</S.LogoTextBottom>
            </S.LogoText>
          </S.LogoContainer>

          {/* 메인 컨텐츠 */}
          <S.MainContent>
            {/* 헤드라인 */}
            <S.HeadlineContainer>
              <S.Headline>
                내부 문서는 <span className="accent">안전하게</span>,
                <br />
                AI로 <span className="accent">똑똑하게</span>.
              </S.Headline>
            </S.HeadlineContainer>

            {/* 설명 */}
            <S.DescriptionContainer>
              <S.Description>
                원문을 외부로 보내지 않고,
                <br />
                조직 내부에서 AI가 답변의 출처를 찾아드립니다.
              </S.Description>
            </S.DescriptionContainer>

            {/* 기능 목록 */}
            <S.FeatureList>
              <S.FeatureItem>
                <S.FeatureIconBox>
                  <S.FeatureIcon>
                    <LockFeatureIcon />
                  </S.FeatureIcon>
                </S.FeatureIconBox>
                <S.FeatureText>
                  원문 외부 전송 없는 벡터 기반 검색
                </S.FeatureText>
              </S.FeatureItem>
              <S.FeatureItem>
                <S.FeatureIconBox>
                  <S.FeatureIcon>
                    <ShieldFeatureIcon />
                  </S.FeatureIcon>
                </S.FeatureIconBox>
                <S.FeatureText>조직 내부에서만 처리되는 답변</S.FeatureText>
              </S.FeatureItem>
              <S.FeatureItem>
                <S.FeatureIconBox>
                  <S.FeatureIcon>
                    <ChatFeatureIcon />
                  </S.FeatureIcon>
                </S.FeatureIconBox>
                <S.FeatureText>모든 접속·활동 감사 로그 기록</S.FeatureText>
              </S.FeatureItem>
            </S.FeatureList>
          </S.MainContent>

          {/* 푸터 */}
          <S.Footer>
            <S.FooterText>
              © 2026 <span className="highlight">Vectra Secure</span>.
              <br />
              Enterprise-grade AI for secure organizations.
            </S.FooterText>
          </S.Footer>
        </S.LeftPanel>

        {/* 오른쪽 패널 - 로그인 폼 */}
        <S.RightPanel>
          <S.FormContainer>
            {/* 타이틀 */}
            <S.TitleSection>
              <S.LoginLabel>LOGIN</S.LoginLabel>
              <S.LoginTitle>로그인</S.LoginTitle>
            </S.TitleSection>

            {/* 로그인 폼 */}
            <S.Form onSubmit={handleLogin}>
              {/* 에러 메시지 */}
              {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}

              {/* 아이디 입력 */}
              <IsInputText
                label="아이디"
                size="medium"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setErrorMessage("");
                }}
                leftIconSlot={<UserIcon />}
                placeholderText="입력해주세요."
                fullWidth
                required
              />

              {/* 비밀번호 입력 */}
              <IsInputText
                label="비밀번호"
                size="medium"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                leftIconSlot={<LockIcon />}
                placeholderText="입력해주세요."
                fullWidth
                required
              />

              {/* 로그인 버튼 */}
              <S.LoginButtonWrapper>
                <IsButton
                  type="submit"
                  variant="solid"
                  color="primary"
                  size="lg"
                  fullWidth
                  disabled={loginMutation.isPending}
                  loading={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "로그인 중..." : "로그인"}
                </IsButton>
              </S.LoginButtonWrapper>

              {/* 안내 텍스트 */}
              <S.InfoContainer>
                <S.InfoIcon>
                  <InfoCircleIcon />
                </S.InfoIcon>
                <S.InfoText>
                  아이디나 비밀번호를 잊으셨나요?{" "}
                  <span className="highlight">조직 관리자</span>에게 문의해
                  주세요.
                </S.InfoText>
              </S.InfoContainer>

              {/* 테스트 계정 (임시) */}
              <S.TestAccountSection>
                <S.TestAccountLabel>테스트 계정</S.TestAccountLabel>
                <S.TestAccountList>
                  {SEED_ACCOUNTS.map((account) => (
                    <S.TestAccountButton
                      key={account.userId}
                      type="button"
                      onClick={() => {
                        setUserId(account.userId);
                        setPassword(SEED_PASSWORD);
                        setErrorMessage("");
                      }}
                    >
                      {account.userId}
                    </S.TestAccountButton>
                  ))}
                </S.TestAccountList>
              </S.TestAccountSection>
            </S.Form>
          </S.FormContainer>
        </S.RightPanel>
      </S.Container>
    </>
  );
}
