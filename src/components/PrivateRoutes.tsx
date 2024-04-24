import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLogin = cookies.get("isLoggedIn"); // true | false

  return isLogin ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
