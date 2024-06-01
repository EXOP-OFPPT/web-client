import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { collection, deleteDoc, doc, getDocs, query, writeBatch } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { getEmployees } from "./GetSlice";

// Interface for error
interface Error {
  code: string;
  message: string;
}


export type EmployeeType = {
  matricule: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
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
const deleteEmployeeSlice = createSlice({
  name: "deleteEmployeeSlice",
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
} = deleteEmployeeSlice.actions;

export default deleteEmployeeSlice.reducer;

// Thunk to delete employee
export const deleteEmployee =
  (docId: string): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      try {
        console.log("Deleting employee... ", docId);
        console.log(auth.currentUser?.email)
        // Delete contributions subcollection
        const contributionsRef = collection(db, "employees", docId, "contributions");
        const q = query(contributionsRef);
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        // Delete employee document
        deleteDoc(doc(db, "employees", docId)).then(() => {
          dispatch(actionSuccess("Employee deleted successfully"));
          dispatch(getEmployees());
        }).catch((error) => {
          dispatch(actionFailed({ code: error.code, message: error.message }));
        });
      } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
      } finally {
        dispatch(setLoading(false));
      }
    };
