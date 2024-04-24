import React from "react";
import ReactDOM from "react-dom/client";

// ------------- CSS/UI import --------------
import "./index.css";
import { Loader2 } from "lucide-react";

// ------------- Cookies import --------------
// import Cookies from "universal-cookie";
// const cookies = new Cookies(null, { path: "/" });

// ------------- Redux import --------------
import { Provider } from "react-redux";
import { store } from "./state/store";

// ------------- Router import --------------
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";

// ------------- Layout & Theme import --------------
import { ThemeProvider } from "./components/theme-provider";
import RootLayout from "./layouts/RootLayout";

// ------------- Components import --------------
import ProtectedRoute from "./components/PrivateRoutes";
import App from "./App";
import Login from "./components/Auth/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";


// ------------- Router --------------
const router = createBrowserRouter([
  {
    path: "/app/*",
    element: (
      <ProtectedRoute>
        <RootLayout>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="app" element={<App />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RootLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// ------------- Router Provider --------------
const AppRouter = () => {
  // const isLogin = cookies.get("isLoggedIn"); // true | false

  return (
    <>
      {/* {isLogin ? <Button>Sign Out</Button> : <Button>Sign In</Button>} */}
      <RouterProvider router={router} />
      <Loader2 />
    </>
  );
};

// ------------- This is Main Render --------------
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppRouter />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
