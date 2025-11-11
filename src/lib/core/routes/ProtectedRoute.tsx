import { Navigate, useLocation } from "react-router-dom";
import { readAccessToken } from "@/lib/functions/authFunctions";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = readAccessToken(); // 로그인 토큰 확인
  const location = useLocation();

  return token ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" replace state={{ from: location }} />
  );
}
