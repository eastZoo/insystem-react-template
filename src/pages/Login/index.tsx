import * as S from "./LoginPage.style";
import ImgCheckbox from "../../styles/assets/img/logo.png";
import { useEffect, useState } from "react";
import { useLogin } from "@/lib/hooks/useAuth";
import { isApiSuccess } from "@/types/api";
import { readAccessToken } from "@/lib/functions/authFunctions";
import { useLocation, useNavigate } from "react-router-dom";

const SEED_ACCOUNTS = [
  { email: "inadmin", role: "ADMIN" },
  { email: "admin", role: "MANAGER" },
  { email: "intest", role: "DEVELOPER" },
] as const;

const SEED_PASSWORD = "1";

/**
 * 로그인 페이지
 * - 버튼 클릭 시 임시 토큰을 localStorage에 저장
 * - 로그인 후 원래 가려던 경로로 redirect
 */
export default function LoginPage() {
  /** ========== state 영역 ========== */
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const [userId, setUserId] = useState<string>(SEED_ACCOUNTS[0].email);
  const [password, setPassword] = useState<string>(SEED_PASSWORD);
  const [errorMessage, setErrorMessage] = useState("");

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/";

  function safeAppPath(pathname: string): string {
    if (!pathname.startsWith("/") || pathname.startsWith("//")) return "/";
    return pathname;
  }

  useEffect(() => {
    if (readAccessToken()) {
      navigate(safeAppPath(from), { replace: true });
    }
  }, [from, navigate]);

  /** ========== api 영역 ========== */
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

  /** ========== 비즈니스 로직 영역 ========== */

  return (
    <>
      <title>로그인</title>
      <S.Container>
        <S.LoginCard>
          {/* 헤더 */}
          <S.CardHeader>
            <S.LogoContainer>
              <S.LogoBox>
                <img
                  src={ImgCheckbox}
                  alt="logo"
                  style={{
                    width: "165px",
                    height: "72px",
                    display: "block",
                    objectFit: "contain",
                    marginRight: "10px",
                    marginBottom: "0.5rem",
                  }}
                />
              </S.LogoBox>
            </S.LogoContainer>
            <S.Subtitle>SAMPLE SYSTEM</S.Subtitle>
          </S.CardHeader>

          {/* 폼 */}
          <S.FormContainer onSubmit={handleLogin}>
            {/* 에러 메시지 */}
            {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}

            {/* 아이디 입력 */}
            <S.InputGroup>
              <S.Label>아이디</S.Label>
              <S.InputWrapper>
                <S.InputIcon>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </S.InputIcon>
                <S.Input
                  id="text"
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="아이디를 입력해주세요."
                  required
                />
              </S.InputWrapper>
            </S.InputGroup>

            {/* 비밀번호 입력 */}
            <S.InputGroup>
              <S.Label htmlFor="password">비밀번호</S.Label>
              <S.InputWrapper>
                <S.InputIcon>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </S.InputIcon>
                <S.Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="비밀번호를 입력해주세요."
                  required
                />
              </S.InputWrapper>
            </S.InputGroup>

            {/* 로그인 유지 & 비밀번호 찾기 */}
            <S.OptionsRow>
              <S.CheckboxLabel>
                <input type="checkbox" />
                <span>로그인 상태 유지</span>
              </S.CheckboxLabel>
              <S.Link href="#">비밀번호 찾기</S.Link>
            </S.OptionsRow>

            {/* 로그인 버튼 */}
            <S.LoginButton
              type="submit"
              disabled={loginMutation.isPending}
              $isLoading={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <svg className="spinner" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  로그인 중...
                </>
              ) : (
                <>로그인</>
              )}
            </S.LoginButton>

            <div
              style={{
                marginTop: 16,
                padding: "12px 14px",
                borderRadius: 8,
                background: "rgba(0, 0, 0, 0.03)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                시드 계정 (비밀번호: {SEED_PASSWORD})
              </p>
              {SEED_ACCOUNTS.map(({ email, role }) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => {
                    setUserId(email);
                    setPassword(SEED_PASSWORD);
                    setErrorMessage("");
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    padding: "4px 0",
                    cursor: "pointer",
                    color: "#2563eb",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                >
                  {email} - {role}
                </button>
              ))}
            </div>
          </S.FormContainer>

          {/* 푸터 */}
          <S.CardFooter>
            <p>
              계정이 없으신가요? <S.Link href="#">회원가입</S.Link>
            </p>
          </S.CardFooter>
        </S.LoginCard>
      </S.Container>
    </>
  );
}
