import { ACCESS_TOKEN } from "@/lib/constants/sharedStrings";
import { writeAccessToken } from "@/lib/functions/authFunctions";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * 로그인 페이지
 * - 버튼 클릭 시 임시 토큰을 localStorage에 저장
 * - 로그인 후 원래 가려던 경로로 redirect
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };

  const handleLogin = () => {
    // ⚠️ 실제에선 서버로 로그인 요청 후 토큰 저장
    writeAccessToken(ACCESS_TOKEN);

    // 로그인 전에 가려던 페이지 (없으면 /)
    const redirectTo = location.state?.from?.pathname || "/";
    navigate(redirectTo, { replace: true });
  };

  return (
    <>
      <title>로그인</title>
      <div style={{ padding: "24px" }}>
        <h2>로그인 페이지</h2>
        <button onClick={handleLogin}>임시 로그인</button>
      </div>
    </>
  );
}
