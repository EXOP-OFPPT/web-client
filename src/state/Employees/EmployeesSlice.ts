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
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: string;
};

// Interface for AuthState
interface EmployeesState {
    employees: EmployeeType[] | [];
    isLoading: boolean;
    error: Error | null;
}


// Initial state
const initialState: EmployeesState = {
    employees: [],
    isLoading: false,
    error: null,
};

// Create slice
const Employees = createSlice({
    name: "employees",
    initialState,
    reducers: {
        actionSuccess: (state, action: PayloadAction<any>) => {
            console.log(action.payload);
            state.isLoading = false;
            state.employees = action.payload;
            state.error = null;
        },
        actionFailed: (state, action: PayloadAction<Error>) => {
            state.error = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { actionSuccess, actionFailed, setLoading } = Employees.actions;

export default Employees.reducer;

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
export const GetEmployees = (): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    try {
        const querySnapshot = await getDocs(collection(db, "employees"));
        const employees: DocumentData = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            employees.push(doc.data());
        });
        dispatch(actionSuccess(employees));
    } catch (error: any) {
        console.log("Error: ", error);
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
};
