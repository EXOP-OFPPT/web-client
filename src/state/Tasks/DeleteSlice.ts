import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getEmployeeTasks, getKpiTasks, getTasks } from "./GetSlice";
import { getKpis } from "../Kpis/GetSlice";

// Interface for error
interface Error {
  code: string;
  message: string;
}

interface DeletePyload {
  docId: string;
  kpiCode: string;
  from: string;
  email: string;
}

export type taskType = {
  id: string;
  title: string;
  probleme: string;
  status: "todo" | "inprogress" | "done" | "verified";
  createdAt: string;
  deadLine: string;
  assignedTo: string;
  completedAt?: string;
  kpiCode: string;
};

// Interface for DeleteState
interface DeleteState {
  loading: boolean;
  error: Error | null;
  message: string | null;
}

// Initial state
const initialState: DeleteState = {
  loading: false,
  error: null,
  message: null,
};

// Create slice
const deleteTaskSlice = createSlice({
  name: "deleteTaskSlice",
  initialState,
  reducers: {
    actionSuccess: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.message = action.payload;
    },
    actionFailed: (state, action: PayloadAction<Error | null>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload;
    },
    setError: (state, action: PayloadAction<Error | null>) => {
      state.error = action.payload;
    },
    clearMessageAndError: (state) => {
      state.message = null;
      state.error = null;
    },
  },
});

export const {
  actionSuccess,
  actionFailed,
  setLoading,
  setMessage,
  setError,
  clearMessageAndError,
} = deleteTaskSlice.actions;

export default deleteTaskSlice.reducer;

export const deleteTask =
  ({ docId, kpiCode, from, email }: DeletePyload): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      deleteDoc(doc(db, "tasks", docId)).then(() => {
        dispatch(actionSuccess("Task deleted successfully"));
        if (from === "tasks") {
          dispatch(getTasks());
        }
        else if ((from === "myTasks") && email) {
          dispatch(getEmployeeTasks(email));
        }
        else if (from === "kpiTasks") {
          dispatch(getKpiTasks(kpiCode));
        }
        dispatch(getKpis());
      }).catch((error: any) => {
        dispatch(actionFailed({ code: error.code, message: error.message }))
      })
    };
