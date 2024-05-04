import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLogin = cookies.get("user"); // true | false
  const reduxIsLoading = useSelector((state: RootState) => state.auth.isLoading);

  return isLogin || reduxIsLoading ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
