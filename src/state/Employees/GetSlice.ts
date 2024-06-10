import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store';
import { collection, doc, DocumentData, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";


// Interface for error
interface Error {
    code: string;
    message: string;
}

export type Avatar = {
    photoURL: string;
    photoName: string;
}

export type ContributionType = {
    contribute: string;
    contributedAt: string;
};

export type EmployeeType = {
    matricule: number | string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    role: string;
    photoURL?: string;
    avatar?: Avatar;
};


// Interface for AuthState
interface EmployeesState {
    employees: EmployeeType[] | [];
    employee: EmployeeType | {};
    employeeContributions: ContributionType[] | [];
    loading: boolean;
    error: Error | null;
    message: string | null;
    employeeExist: any;
}


// Initial state
const initialState: EmployeesState = {
    employees: [],
    employee: {},
    employeeContributions: [],
    loading: false,
    error: null,
    message: null,
    employeeExist: null,
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
        setEmployeeContributions: (state, action: PayloadAction<ContributionType[] | []>) => {
            state.employeeContributions = action.payload;
        },
        setEmployee: (state, action: PayloadAction<EmployeeType>) => {
            state.employee = action.payload;
        },
        setEmployeeExist: (state, action: PayloadAction<any>) => {
            state.employeeExist = action.payload;
        }
    },
});

export const { actionSuccess, actionFailed, setLoading, setMessage, clearMessageAndError, setEmployeeContributions, setEmployee, setEmployeeExist } = getEmployeesSlice.actions;

export default getEmployeesSlice.reducer;


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

// get employee with email
export const getEmployeeByEmail = (email: string): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());
    try {
        // Get employee with email
        const docRef = doc(db, "employees", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const employee = docSnap.data() as EmployeeType;
            dispatch(setEmployee(employee));
        } else {
            dispatch(setMessage("Employee not found"));
        }
    } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
}

// Async action creator
export const getEmployeeContributions = (email: string): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());
    try {
        // Get contributions for the employee
        const querySnapshot = await getDocs(collection(db, "employees", email, "contributions"));
        const contributions: ContributionType[] = [];
        querySnapshot.forEach((doc) => {
            contributions.push(doc.data() as ContributionType);
        });
        dispatch(setEmployeeContributions(contributions));
        dispatch(setLoading(false));
    } catch (error: any) {
        console.log({ code: error.code, message: error.message });
        dispatch(setLoading(false));
    } finally {
        dispatch(setLoading(false));
    }
};

