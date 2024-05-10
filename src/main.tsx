import React from "react";
import ReactDOM from "react-dom/client";

// ------------- CSS/UI import --------------
import "./style/index.css";

// ------------- Cookies import --------------
// import Cookies from "universal-cookie";
// const cookies = new Cookies(null, { path: "/" });
// cookies.set("isLoggedIn", "true", { path: "/" });

// ------------- Redux import --------------
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./state/store";

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
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Employees from "./pages/Employees";
import ResetPassword from "./components/Auth/ResetPassword";
import Profile from "./pages/Profile";
import Kpi from "./pages/Kpi";

// ------------- Router --------------
const router = createBrowserRouter([
  {
    path: "/app/*",
    element: (
      <ProtectedRoute>
        <RootLayout>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route index path="employees" element={<Employees />} />
            <Route index path="kpi" element={<Kpi />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RootLayout>
      </ProtectedRoute>
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
  // const isLogin = cookies.get("isLoggedIn"); // true | false
  // const pickedTheme = useSelector(
  //   (state: RootState) => state.navBar.pickedTheme
  // );

  // useEffect(() => {
  //   console.log("Theme" , pickedTheme);
  //   // Create a new link element
  //   const linkElement = document.createElement("link");
  //   linkElement.rel = "stylesheet";
  //   linkElement.href = `./src/style/Themes/${pickedTheme}.css`;

  //   // Insert the link element into the head tag
  //   document.head.appendChild(linkElement);

  //   // Return a cleanup function to remove the link element when the component unmounts
  //   // return () => {
  //   //   document.head.removeChild(linkElement);
  //   // };

  // }, [pickedTheme]);
  // const employees = useSelector((state: RootState) => state.getEmployees.employees);
  // const kpis = useSelector((state: RootState) => state.getKpis.kpis);

  return (
    <>
      {/* {isLogin ? <Button>Sign Out</Button> : <Button>Sign In</Button>} */}
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
