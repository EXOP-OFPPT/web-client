import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// ------------- Redux import --------------
import { Provider, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "./state/store";
import { loginSuccess, logoutUser } from "./state/auth/AuthSlice";
import { useDispatch } from "react-redux";

// ------------- Router import --------------
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

// ------------- Layout & Theme import --------------
import { ThemeProvider } from "./components/theme-provider";
import RootLayout from "./layouts/RootLayout";

// ------------- Firebase import --------------
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

// ------------- Components import --------------
import App from "./App";
import Login from "./components/Auth/Login";



// ------------- This is Private Routes --------------
const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/app" element={<RootLayout />}>
      <Route path="m" element={<App />} />
      {/* <Route path="*" element={<ExopPagesLayout />}>
          <Route path="" element={<App />} />
        </Route> */}
      </Route>
      <Route path='*' element={<Navigate to='/app' replace />} />
    </Routes>
  );
};

// ------------- This is Public Routes --------------
const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
};


// ------------- This is Handle Routes --------------
const HandleRoutes = () => {
  // Call useSelector at the top level of your component
  const isAuthenticated = useSelector((state: RootState) => state.auth.isLogin);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged called', user);
      if (user) {
        dispatch(loginSuccess(user.providerData[0]));
      } else {
        console.log('User is not authenticated, dispatching logoutUser action');
        dispatch(logoutUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {
          isAuthenticated
            ? <Route path="/*" element={<PrivateRoutes />} />
            : <Route path="/*" element={<PublicRoutes />} />
        }
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

// ------------- This is Main Render --------------
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <HandleRoutes />
      </ThemeProvider>
    </Provider>
  </React.StrictMode >
);
