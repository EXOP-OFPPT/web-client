import { configureStore } from "@reduxjs/toolkit";
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import authSlice from "./auth/AuthSlice";
import navBarSlice from "./NavBar/NavBarSlice";
// --------------- Employees Slices ----------------
import getSlice from "./Employees/GetSlice";
import CreateSlice from "./Employees/CreateSlice";
import DeleteSlice from "./Employees/DeleteSlice";
import UpdateSlice from "./Employees/UpdateSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    getEmployees: getSlice,
    createEmployee: CreateSlice,
    updateEmployee: UpdateSlice,
    deleteEmployee: DeleteSlice,
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
