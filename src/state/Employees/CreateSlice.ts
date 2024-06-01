import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, store } from "../store";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getEmployees } from "./GetSlice";
import { sendEmail } from "@/lib/SendEmail";

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

// Interface for User action payload
interface UserPayload {
  email: string;
  password: string;
  userData: EmployeeType;
}

// Interface for AuthState
interface CreateState {
  employee: EmployeeType | {};
  loading: boolean;
  error: Error | null;
  message: string | null;
  employeesExist: any;
}

// Initial state
const initialState: CreateState = {
  employee: {},
  loading: false,
  error: null,
  message: null,
  employeesExist: null,
};

// Create slice
const createEmployeeSlice = createSlice({
  name: "createEmployeeSlice",
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
    setEmployeesExist: (state, action: PayloadAction<any>) => {
      state.employeesExist = action.payload;
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
  setEmployeesExist,
} = createEmployeeSlice.actions;

export default createEmployeeSlice.reducer;

// Thunk to check if user exist
export const checkUserExist =
  (docId: string, setAction: Function): AppThunk =>
    async (dispatch) => {
      try {
        const docRef = doc(db, "employees", docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          dispatch(setAction(docSnap.data()));
        } else {
          // docSnap.data() will be undefined in this case
          dispatch(setAction(null));
        }
      } catch (error: any) {
        dispatch(setAction(null));
      }
    };

export const createEmployee =
  ({ email, password, userData }: UserPayload): AppThunk =>
    async (dispatch) => {
      const admin = auth.currentUser;
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      // Check if user already exist
      await dispatch(checkUserExist(email, setEmployeesExist));
      if (!store.getState().createEmployee.employeesExist) {
        console.log("Creating employee");
        try {
          //! Add a new document with account id.
          await setDoc(doc(db, "employees", email), {
            ...userData,
          });
          //! Create user with email and password
          createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {
              // Send the email
              await sendEmail({ from: admin?.email || "Admin.com", to: email, password, subject: 'Welcome to EXOP App' });
              dispatch(actionSuccess("Employee created successfully, Email send to user"));
            })
            .catch(() => {
              dispatch(setLoading(false));
              dispatch(
                actionSuccess(
                  "Employee data saved, but the user account already exists"
                )
              );
            });
          dispatch(getEmployees());
        } catch (error) {
          dispatch(setLoading(false));
          dispatch(
            actionFailed({ code: "500", message: "Failed to save employee data" })
          );
        }
      } else {
        dispatch(
          actionFailed({ code: "500", message: "Employee already exists" })
        );
      }
    };
