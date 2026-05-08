/**
 * LoginPage.tsx — 로그인 페이지
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * [네비게이션 방식]
 *
 *   mutate() 두 번째 인자의 onSuccess 안에서 바로 navigate() 하면
 *   React Query v5와 React Router 렌더 타이밍이 어긋나 URL만 바뀌는 문제가 있을 수 있습니다.
 *
 *   mutateAsync()는 훅의 onSuccess(writeAccessToken)까지 끝난 뒤에 이행되므로,
 *   응답이 isApiSuccess일 때만 navigate(safeAppPath(from)) 한 번 호출합니다.
 *   (loginMutation.isSuccess 만으로는 API가 success:false 를 줘도 true 가 될 수 있어 사용하지 않습니다.)
 *
 * [from 리다이렉트]
 *   ProtectedRoute가 리다이렉트할 때 state.from에 원래 경로를 담습니다.
 *   로그인 성공 후 해당 경로로 복귀합니다.
 *
 * [이미 로그인된 경우]
 *   토큰이 메모리에 있으면 홈으로 즉시 리다이렉트합니다.
 *
 * [시드 계정]
 *   admin@eastzoo.local     / Admin123!  (모든 권한)
 *   manager@eastzoo.local   / Admin123!  (삭제 불가)
 *   developer@eastzoo.local / Admin123!  (조회/등록만)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { IsButton, IsChip, IsInputText } from "insystem-atoms";
import { Icon } from "@/components/atoms/Icon";
import { useLogin } from "@/hooks/useAuth";
import { readAccessToken } from "@/lib/functions/authFunctions";
import { isApiSuccess } from "@/types/api";

// ── 스타일 ────────────────────────────────────────────────────────────────────

const PageRoot = styled.div`
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(4)};
  overflow-y: auto;
  background: linear-gradient(
    165deg,
    ${({ theme }) => theme.colors.primary}18 0%,
    ${({ theme }) => theme.colors.bg} 42%,
    ${({ theme }) => theme.colors.secondary}14 100%
  );
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(7)};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bg};
  box-shadow:
    0 4px 6px rgba(17, 24, 39, 0.04),
    0 20px 48px rgba(17, 24, 39, 0.08);
  border: 1px solid rgba(107, 114, 128, 0.18);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(6)};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

const SeedHint = styled.div`
  margin-top: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary}0d;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.8;
`;

const SeedHintTitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(1)};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SeedAccount = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary};
  font-family: monospace;
  line-height: 1.8;

  &:hover {
    text-decoration: underline;
  }
`;

// ── 시드 계정 (seed.ts와 동기화) ──────────────────────────────────────────────

const SEED_ACCOUNTS = [
  { userId: "inadmin", role: "ADMIN" },
  { userId: "inmanager", role: "MANAGER" },
  { userId: "indeveloper", role: "DEVELOPER" },
] as const;

const SEED_PASSWORD = "qwer1234";

/** 같은 오리진 SPA 경로만 허용 (오픈 리다이렉트 완화) */
function safeAppPath(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return "/";
  return pathname;
}

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * ProtectedRoute가 리다이렉트할 때 state.from에 원래 경로를 담습니다.
   * 로그인 성공 후 해당 경로로 복귀합니다.
   */
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/";

  const [userId, setUserId] = useState<string>(SEED_ACCOUNTS[0].userId);
  const [password, setPassword] = useState<string>(SEED_PASSWORD);

  const loginMutation = useLogin();

  /**
   * 이미 로그인된 경우 홈으로 즉시 리다이렉트합니다.
   * (예: 로그인 URL을 직접 입력했을 때)
   */
  useEffect(() => {
    if (readAccessToken()) {
      navigate(safeAppPath(from), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    try {
      const res = await loginMutation.mutateAsync({
        userId: userId,
        password: password,
      });
      if (!isApiSuccess(res) || !readAccessToken()) return;
      navigate(safeAppPath(from), { replace: true });
    } catch {
      // 네트워크 등 — useLogin onError 가 토스트 처리
    }
  };

  return (
    <>
      <title>로그인</title>
      <PageRoot>
        <Card>
          <HeaderRow>
            <Title>로그인</Title>
            <IsChip>Eastzoo Template</IsChip>
          </HeaderRow>
          <Subtitle>
            시드 계정으로 로그인하거나 아래 계정을 클릭해 자동 입력하세요.
          </Subtitle>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <FieldStack>
              <div>
                <IsInputText
                  id="login-email"
                  type="text"
                  autoComplete="username"
                  placeholderText="아이디를 입력하세요"
                  value={userId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserId(e.target.value)
                  }
                  fullWidth
                  label="아이디"
                  size="medium"
                />
              </div>
              <div>
                <IsInputText
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholderText="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  fullWidth
                  label="비밀번호"
                  size="medium"
                />
              </div>
            </FieldStack>

            <IsButton
              type="submit"
              variant="solid"
              color="primary"
              interaction
              size="md"
              leftIconSlot={<Icon name="login" />}
              disabled={loginMutation.isPending}
              fullWidth
            >
              {loginMutation.isPending ? "로그인 중…" : "로그인"}
            </IsButton>
          </form>

          {/* ── 시드 계정 빠른 입력 ── */}
          <SeedHint>
            <SeedHintTitle>시드 계정 (비밀번호: {SEED_PASSWORD})</SeedHintTitle>
            {SEED_ACCOUNTS.map(({ userId: seedUserId, role }) => (
              <SeedAccount
                key={seedUserId}
                type="button"
                onClick={() => {
                  setUserId(seedUserId);
                  setPassword(SEED_PASSWORD);
                }}
              >
                {seedUserId} — {role}
              </SeedAccount>
            ))}
          </SeedHint>
        </Card>
      </PageRoot>
    </>
  );
}
