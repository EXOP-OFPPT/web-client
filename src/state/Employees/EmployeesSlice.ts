import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, store } from '../store';
import { collection, doc, DocumentData, getDoc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";


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

// Interface for User action payload
interface UserPayload {
    email: string;
    password: string;
    userData: EmployeeType
}

// Interface for AuthState
interface EmployeesState {
    employees: EmployeeType[] | [];
    isLoading: boolean;
    createLoading: boolean;
    error: Error | null;
    message: string | null;
    employeesExist: any;
}


// Initial state
const initialState: EmployeesState = {
    employees: [],
    isLoading: false,
    createLoading: false,
    error: null,
    message: null,
    employeesExist: null,
};



// Create slice
const Employees = createSlice({
    name: "employees",
    initialState,
    reducers: {
        getAllActionSuccess: (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.employees = action.payload;
            state.error = null;
        },
        createdActionSuccess: (state, action: PayloadAction<string | null>) => {
            state.createLoading = false;
            state.message = action.payload;
        },
        actionFailed: (state, action: PayloadAction<Error | null>) => {
            state.createLoading = false;
            state.error = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setCreateLoading: (state, action: PayloadAction<boolean>) => {
            state.createLoading = action.payload;
        },
        setMessage: (state, action: PayloadAction<string | null>) => {
            state.message = action.payload;
        },
        setEmployeesExist: (state, action: PayloadAction<any>) => {
            state.employeesExist = action.payload;
        }
    },
});

export const { getAllActionSuccess,createdActionSuccess, actionFailed, setLoading, setCreateLoading, setMessage, setEmployeesExist } = Employees.actions;

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



export const checkUserExist = (docId: string): AppThunk => async dispatch => {
    try {
        const docRef = doc(db, "employees", docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            dispatch(setEmployeesExist(docSnap.data()));
        } else {
            // docSnap.data() will be undefined in this case
            dispatch(setEmployeesExist(null));
        }
    } catch (error: any) {
        dispatch(setEmployeesExist(null));
    }
}

// Async action creator
export const getEmployees = (): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    try {
        // Get all employees
        const querySnapshot = await getDocs(collection(db, "employees"));
        const employees: DocumentData = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            employees.push(doc.data());
        });
        dispatch(getAllActionSuccess(employees));
    } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
};

export const createEmployee = ({ email, password, userData }: UserPayload): AppThunk => async dispatch => {
    // Reset message and error
    await dispatch(setMessage(null));
    await dispatch(actionFailed(null));
    dispatch(setCreateLoading(true));
    // Check if user already exist
    await dispatch(checkUserExist(email));
    if (!store.getState().employees.employeesExist) {
        // Create user with email and password
        createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {
                // Add a new document with account id.
                await setDoc(doc(db, "employees", email), userData);
                dispatch(createdActionSuccess('Employee created successfully'));
                dispatch(getEmployees());
            })
            .catch((error) => {
                dispatch(actionFailed({ code: error.code, message: error.message }));
            });
    } else {
        dispatch(actionFailed({ code: "500", message: "User Already exist" }));
    }
};
