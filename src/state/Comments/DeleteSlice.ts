import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// Interface for error
interface Error {
  code: string;
  message: string;
}

interface DeletePyload {
  docId: string;
  user: {
    role: string;
    email: string;
  };
}

export type taskType = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done" | "verified";
  bonus: number;
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
  ({ docId, user }: DeletePyload): AppThunk =>
    async (dispatch) => {
      console.log(user);
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      try {
        await deleteDoc(doc(db, "tasks", docId));
        dispatch(actionSuccess("Task deleted successfully"));
      } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
      }
    };
