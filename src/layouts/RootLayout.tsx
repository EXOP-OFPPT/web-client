import { logoutUser } from "@/state/auth/AuthSlice";
import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// --------------------------------------------------------
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div className="min-h-[100vh] w-full overflow-hidden">
      <div className="absolute right-8 top-4">
        <ModeToggle />
      </div>
      <Button
        className="bg-red-500 hover:bg-red-600 text-white mt-4 ml-8"
        onClick={handleLogout}
      >
        Logout
      </Button>
      {children}
    </div>
  );
};

export default RootLayout;
