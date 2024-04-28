import { logoutUser } from "@/state/auth/AuthSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// --------------------------------------------------------
import Sidebar from "@/components/Dashboard/Sidebar";
import Nav from "@/pages/Nav";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const isActive = useSelector((state: RootState) => state.sideBar.isActive);


  return (
    <div className="min-h-[100vh] w-full overflow-hidden">
      <div className="flex">
        {isActive && <Sidebar />}

        {/*//! Display Children */}
        <div className="flex-1">
          <Nav />
          {children}
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
