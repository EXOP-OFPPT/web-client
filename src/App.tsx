import { Button } from "./components/ui/button";
import { logoutUser } from "./state/auth/AuthSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./state/store";
import Home from "./pages/Home";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex flex-col w-full min-h-[100vh] items-center justify-center ">
      <Button
        className="bg-red-500 hover:bg-red-600 text-white"
        onClick={() => dispatch(logoutUser())}
      >
        Logout
      </Button>
      <Home />
    </div>
  );
}
