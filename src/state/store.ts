import { configureStore } from "@reduxjs/toolkit";
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import authSlice from "./auth/AuthSlice";
import navBarSlice from "./NavBar/NavBarSlice";
// --------------- Employees Slices ----------------
import getEmployeesSlice from "./Employees/GetSlice";
import createEmployeeSlice from "./Employees/CreateSlice";
import updateEmployeeSlice from "./Employees/UpdateSlice";
import deleteEmployeeSlice from "./Employees/DeleteSlice";
// --------------- Kpis Slices ----------------
import getKpisSlice from "./Kpis/GetSlice";
import createKpiSlice from "./Kpis/CreateSlice";
import updateKpiSlice from "./Kpis/UpdateSlice";
import deleteKpiSlice from "./Kpis/DeleteSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    navBar: navBarSlice,
    // ---------------------------------
    getEmployees: getEmployeesSlice,
    createEmployee: createEmployeeSlice,
    updateEmployee: updateEmployeeSlice,
    deleteEmployee: deleteEmployeeSlice,
    // ---------------------------------
    getKpis: getKpisSlice,
    createKpi: createKpiSlice,
    updateKpi: updateKpiSlice,
    deleteKpi: deleteKpiSlice,
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
