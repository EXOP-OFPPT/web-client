import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getEvents } from "./GetSlice";
import { updateContribution } from "../Employees/UpdateSlice";

// Interface for error
interface Error {
  code: string;
  message: string;
}

interface DeletePyload {
  docId: string;
  contribute: string;
  email: string;
}


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
const deleteEventSlice = createSlice({
  name: "deleteEventSlice",
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
} = deleteEventSlice.actions;

export default deleteEventSlice.reducer;

export const deleteEvent =
  ({ docId, contribute, email }: DeletePyload): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      try {
        await deleteDoc(doc(db, "events", docId)).then(() => {
          dispatch(updateContribution({ email, contribute }));
          dispatch(actionSuccess("Event deleted successfully"));
          dispatch(getEvents());

        }).catch((error) => {
          dispatch(actionFailed({ code: error.code, message: error.message }));
        });
      } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
      }
    };
