import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getTasks } from "./GetSlice";

// Interface for error
interface Error {
  code: string;
  message: string;
}

export type taskType = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
  createdAt: string;
  deadLine: string;
  assignedTo: string;
  idKpi: string;
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

export const deleteKpi =
  (docId: string): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      try {
        await deleteDoc(doc(db, "tasks", docId));
        dispatch(actionSuccess("task deleted successfully"));
        dispatch(getTasks());
      } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
      }
    };
