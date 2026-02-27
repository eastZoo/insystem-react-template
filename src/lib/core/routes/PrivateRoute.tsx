import { Navigate } from "react-router-dom";
import { readAccessToken } from "@/lib/functions/authFunctions";

interface PrivateRouteProps {
  component: React.ReactNode;
  authenticated?: string | null;
}

const PrivateRoute = ({ component }: PrivateRouteProps) => {
  const accessToken = readAccessToken();
  if (accessToken) {
    return <>{component}</>;
  } else {
    return <Navigate to="/auth/login" />;
  }
};

export default PrivateRoute;
