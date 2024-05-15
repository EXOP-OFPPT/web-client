import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store';
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";


// Interface for error
interface Error {
    code: string;
    message: string;
}

export type EmployeeType = {
    matricule: number|string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: string;
    photoURL?: string;
    avatar?: string;
};


// Interface for AuthState
interface EmployeesState {
    employees: EmployeeType[] | [];
    loading: boolean;
    error: Error | null;
    message: string | null;
    employeesExist: any;
}


// Initial state
const initialState: EmployeesState = {
    employees: [],
    loading: false,
    error: null,
    message: null,
    employeesExist: null,
};




// Create slice
const getEmployeesSlice = createSlice({
    name: "getEmployeesSlice",
    initialState,
    reducers: {
        actionSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.employees = action.payload;
            state.error = null;
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
        clearMessageAndError: (state) => {
            state.message = null;
            state.error = null;
        },
        setEmployeesExist: (state, action: PayloadAction<any>) => {
            state.employeesExist = action.payload;
        }
    },
});

export const { actionSuccess, actionFailed, setLoading, setMessage, clearMessageAndError, setEmployeesExist } = getEmployeesSlice.actions;

export default getEmployeesSlice.reducer;

//! Async action creator
// export const observeAuthState = (): AppThunk => dispatch => {
//   onAuthStateChanged(auth, user => {
//     console.log("User: ", user)
//     if (user) {
//       dispatch(loginSuccess(user.providerData[0]));
//     } else {
//       dispatch(logout());
//     }
//   });
// };



// Async action creator
export const getEmployees = (): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());
    try {
        // Get all employees
        const querySnapshot = await getDocs(collection(db, "employees"));
        const employees: DocumentData = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            employees.push(doc.data());
        });
        dispatch(actionSuccess(employees));
    } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
};

