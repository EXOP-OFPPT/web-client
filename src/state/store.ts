import { configureStore } from "@reduxjs/toolkit";
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import authSlice from "./auth/AuthSlice";
import sideBarSlice from "./SideBar/SideBarSlice";
import navBarSlice from "./NavBar/NavBarSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    sideBar: sideBarSlice,
    navBar: navBarSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
