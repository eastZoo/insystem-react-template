import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AuthTemplate } from "@/components/template/AuthTemplate";
import { useLogin } from "@/hooks/useAuth";
import {
  readAccessToken,
  writeAccessToken,
  isMockAuth,
  MOCK_ACCESS_TOKEN,
} from "@/lib/functions/authFunctions";
import { isApiSuccess } from "@/types/api";

/** 로그인 폼 입력값 타입 */
export interface LoginInputs {
  mbrUserId: string;
  mbrUserPwd: string;
}

// ── 시드 계정 ─────────────────────────────────────────────────

const SEED_ACCOUNTS = [
  { email: "admin@eastzoo.local", role: "ADMIN" },
  { email: "manager@eastzoo.local", role: "MANAGER" },
  { email: "developer@eastzoo.local", role: "DEVELOPER" },
] as const;

const SEED_PASSWORD = "Admin123!";

/** 같은 오리진 SPA 경로만 허용 (오픈 리다이렉트 완화) */
function safeAppPath(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return "/";
  return pathname;
}

// ── 시드 계정 스타일 ──────────────────────────────────────────

const SeedHint = styled.div`
  margin-top: 20px;
  padding: 12px 16px;
  width: 400px;
  border-radius: 6px;
  background: ${(props) => props.theme.colors.black5};
  border: 1px solid ${(props) => props.theme.colors.black10};
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.black38};
  line-height: 1.8;
`;

const SeedHintTitle = styled.p`
  margin: 0 0 4px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black80};
  font-size: 1.2rem;
`;

const SeedAccount = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.primary100};
  font-family: monospace;
  line-height: 1.8;

  &:hover {
    text-decoration: underline;
  }
`;

// ── 컴포넌트 ──────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/";

  const { handleSubmit, control, setValue } = useForm<LoginInputs>({
    defaultValues: {
      mbrUserId: SEED_ACCOUNTS[0].email,
      mbrUserPwd: SEED_PASSWORD,
    },
  });

  /** 이미 로그인된 경우 홈으로 즉시 리다이렉트 */
  useEffect(() => {
    if (readAccessToken()) {
      navigate(safeAppPath(from), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: LoginInputs) => {
    // TODO : Mock 모드 API 호출 없이 즉시 로그인
    if (isMockAuth()) {
      writeAccessToken(MOCK_ACCESS_TOKEN);
      navigate(safeAppPath(from), { replace: true });
      return;
    }

    try {
      const res = await loginMutation.mutateAsync({
        email: formData.mbrUserId,
        password: formData.mbrUserPwd,
      });
      if (!isApiSuccess(res) || !readAccessToken()) return;
      navigate(safeAppPath(from), { replace: true });
    } catch {
      // 네트워크 등 — useLogin onError 가 토스트 처리
    }
  };

  return (
    <AuthTemplate title="로그인" subTitle="SAMPLE TEMPLATE">
      <>
        <LoginForm
          onSubmit={handleSubmit(onSubmit)}
          control={control}
          isLoading={loginMutation.isPending}
        />

        {/* ── 시드 계정 빠른 입력 ── */}
        <SeedHint>
          <SeedHintTitle>시드 계정 (비밀번호: {SEED_PASSWORD})</SeedHintTitle>
          {SEED_ACCOUNTS.map(({ email, role }) => (
            <SeedAccount
              key={email}
              type="button"
              onClick={() => {
                setValue("mbrUserId", email);
                setValue("mbrUserPwd", SEED_PASSWORD);
              }}
            >
              {email} — {role}
            </SeedAccount>
          ))}
        </SeedHint>
      </>
    </AuthTemplate>
  );
}
