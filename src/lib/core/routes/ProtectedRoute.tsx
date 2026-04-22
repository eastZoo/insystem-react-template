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
      <Navigate to="/auth/login" replace state={{ from: location }} />
    );
  }

  return <>{children}</>;
}
