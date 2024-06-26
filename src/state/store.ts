import { configureStore } from "@reduxjs/toolkit";
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import authSlice from "./Auth/AuthSlice";
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
// --------------- Tasks Slices ----------------
import getTasksSlice from "./Tasks/GetSlice";
import createTaskSlice from "./Tasks/CreateSlice";
import updateTaskSlice from "./Tasks/UpdateSlice";
import deleteTaskSlice from "./Tasks/DeleteSlice";
// --------------- Posts Slices ----------------
import getPostsSlice from "./Posts/GetSlice";
import createPostsSlice from "./Posts/CreateSlice";
import updatePostsSlice from "./Posts/UpdateSlice";
import deletePostsSlice from "./Posts/DeleteSlice";
// --------------- Comments Slices ----------------
import getCommentsSlice from "./Comments/GetSlice";
import createCommentSlice from "./Comments/CreateSlice";
// --------------- Events Slices ----------------
import getEventsSlice from "./Events/GetSlice";
import createEventSlice from "./Events/CreateSlice";
import updateEventSlice from "./Events/UpdateSlice";
import deleteEventSlice from "./Events/DeleteSlice";

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
        // ---------------------------------
        getTasks: getTasksSlice,
        createTask: createTaskSlice,
        updateTask: updateTaskSlice,
        deleteTask: deleteTaskSlice,
        // ---------------------------------
        getPosts: getPostsSlice,
        createPost: createPostsSlice,
        updatePost: updatePostsSlice,
        deletePost: deletePostsSlice,
        // ---------------------------------
        getComments: getCommentsSlice,
        createComment: createCommentSlice,
        // ---------------------------------
        getEvents: getEventsSlice,
        createEvent: createEventSlice,
        updateEvent: updateEventSlice,
        deleteEvent: deleteEventSlice,
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