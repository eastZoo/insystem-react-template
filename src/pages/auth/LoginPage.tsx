import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AuthTemplate } from "@/components/template/AuthTemplate";
import { writeAccessToken, writeRefreshToken } from "@/lib/functions/authFunctions";
import { request } from "@/lib/api";
import { showAlert } from "@/components/containers/Alert";

/** 로그인 폼 입력값 타입 */
export interface LoginInputs {
  mbrUserId: string;
  mbrUserPwd: string;
}

/** 로그인 API 응답 타입 */
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * 로그인 페이지
 * - react-hook-form으로 아이디/비밀번호 입력값 관리
 * - 로그인 성공 시 토큰을 localStorage에 저장하고 원래 가려던 경로로 이동
 * - 로그인 실패 시 에러 메시지 표시
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm<LoginInputs>({
    defaultValues: {
      mbrUserId: "",
      mbrUserPwd: "",
    },
  });

  const onSubmit = async (formData: LoginInputs) => {
    try {
      setIsLoading(true);

      // ── 실제 API 연동 시 아래 주석을 해제하고 mock 블록을 제거하세요 
      // ── 개발 임시 mock 로그인 ──
      if (!formData.mbrUserId || !formData.mbrUserPwd) {
        await showAlert("아이디와 비밀번호를 입력해주세요.");
        return;
      }
      writeAccessToken("mock-access-token");
      writeRefreshToken("mock-refresh-token");
      // ─────────────────────────────

      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch {
      await showAlert("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate title="로그인" subTitle="SAPMLE TEMPLATE2">
      <LoginForm
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        isLoading={isLoading}
      />
    </AuthTemplate>
  );
}
