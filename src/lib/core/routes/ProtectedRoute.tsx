import { Navigate, useLocation } from "react-router-dom";
import { readAccessToken } from "@/lib/functions/authFunctions";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = readAccessToken();
  const location = useLocation();

  if (!token) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        로그인 페이지로 이동 중…
        <Navigate to="/auth/login" replace state={{ from: location }} />
      </div>
    );
  }

  return <>{children}</>;
}
