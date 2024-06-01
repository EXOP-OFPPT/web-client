import { auth } from "@/firebase/firebase";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: "/" });

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = cookies.get("user");
  const authUser = auth.currentUser;
  const reduxIsLoading = useSelector((state: RootState) => state.auth.isLoading);


  return true ? children : <Navigate to="/login" />;
  // return (user && authUser) || reduxIsLoading ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
