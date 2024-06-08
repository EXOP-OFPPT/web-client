import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

// ------------- CSS/UI import --------------
import "./style/index.css";

// ------------- Cookies import --------------
// import Cookies from "universal-cookie";
// const cookies = new Cookies(null, { path: "/" });
// cookies.set("isLoggedIn", "true", { path: "/" });

// ------------- Redux import --------------
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./state/store";

// ------------- Router import --------------
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";

// ------------- Layout & Theme import --------------
import { ThemeProvider } from "./components/global/theme-provider";
import RootLayout from "./layouts/RootLayout";

// ------------- Components import --------------
import ProtectedRoute from "./components/global/PrivateRoutes";
import Login from "./components/Auth/Login";
// import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Employees from "./pages/Employees";
import ResetPassword from "./components/Auth/ResetPassword";
import Profile from "./pages/Profile";
import Kpi from "./pages/Kpis";
import Tasks from "./pages/Tasks";
import Posts from "./pages/Posts";
import KpiTasks from "./pages/KpiTasks";
import MyTasks from "./pages/MyTasks";
import Dashboard from "./pages/Dashboard";
// import ThemeSwitcher from "./components/global/ThemeSwitcher";
import Events from "./pages/Events";
import LandingPage from "./pages/LandingPage";
import { observeAuthState } from "./state/Auth/AuthSlice";

// ------------- Router --------------
const router = createBrowserRouter([
  {
    path: "/app/*",
    element: (
      <ProtectedRoute>
        <RootLayout>
          <Routes>
            <Route index path="/" element={<Dashboard />} />
            <Route index path="statistics" element={<Dashboard />} />
            <Route index path="employees" element={<Employees />} />
            <Route index path="kpis" element={<Kpi />} />
            <Route index path="kpiTasks" element={<KpiTasks />} />
            <Route index path="tasks" element={<Tasks />} />
            <Route index path="myTasks" element={<MyTasks />} />
            <Route index path="posts" element={<Posts />} />
            <Route index path="events" element={<Events />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RootLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <LandingPage />
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login/*",
    element: (
      <Routes>
        <Route index element={<Login />} />
        <Route path="resetPassword" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// ------------- Router Provider --------------
const AppRouter = () => {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(observeAuthState());
  }, [dispatch]);

  return (
    <>
      {/* <ThemeSwitcher /> */}
      <RouterProvider router={router} />
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
