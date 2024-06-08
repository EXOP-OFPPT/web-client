import { Navigate } from "react-router-dom";
import { auth } from "@/firebase/firebase";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authUser = auth.currentUser;
  const user = useSelector((state: RootState) => state.auth.user);


  // return true ? children : <Navigate to="/login" />;
  return (user && authUser) ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
