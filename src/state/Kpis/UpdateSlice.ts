import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getKpis } from "./GetSlice";
import { getTasks } from "../Tasks/GetSlice";

// Interface for error
interface Error {
    code: string;
    message: string;
}

export type KpiType = {
    code: string;
    title: string;
    description: string;
    minTaux: number;
    currentTaux: number;
    type: string;
    bonus: number,
};


// Interface for User action payload
interface UpdatedKpiPayload {
    code: string;
    updatedData: KpiType;
}

interface UpdatedCurrentTauxKpiPayload {
    code: string;
    bonus: number;
    user: {
        role: string;
        email: string;
    }
}

// Interface for AuthState
interface CreateState {
    kpi: KpiType | {};
    loading: boolean;
    error: Error | null;
    message: string | null;
    KpiExist: any;
}

// Initial state
const initialState: CreateState = {
    kpi: {},
    loading: false,
    error: null,
    message: null,
    KpiExist: null,
};

// Create slice
const updateKpiSlice = createSlice({
    name: "updateKpiSlice",
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
        setKpiExist: (state, action: PayloadAction<any>) => {
            state.KpiExist = action.payload;
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
    setKpiExist,
} = updateKpiSlice.actions;

export default updateKpiSlice.reducer;

// Thunk to check if user exist
export const checkKpiExist =
    (docId: string, setAction: Function): AppThunk =>
        async (dispatch) => {
            try {
                const docRef = doc(db, "kpi", docId);
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

export const updateKpi =
    ({ code, updatedData }: UpdatedKpiPayload): AppThunk =>
        async (dispatch) => {
            // Reset message and error
            dispatch(setLoading(true));
            dispatch(clearMessageAndError());
            // Check if user already exist
            try {
                console.log("Updating kpi");
                //! Update a new document with account id.
                const ref = doc(db, "kpi", code);
                await updateDoc(ref, updatedData);
                dispatch(actionSuccess("Kpi updated successfully"));
                dispatch(getKpis());
            } catch {
                dispatch(
                    actionFailed({ code: "500", message: "Update failed" })
                );
            }
        };




export const updateCurrentTauxTask =
    ({ code, bonus, user }: UpdatedCurrentTauxKpiPayload): AppThunk =>
        async (dispatch) => {
            // Reset message and error
            dispatch(setLoading(true));
            dispatch(clearMessageAndError());
            try {
                console.log("Updating task");
                const ref = doc(db, "kpi", code);
                // Atomically increment the population of the city by 50.
                await updateDoc(ref, {
                    currentTaux: increment(bonus || 0)
                });
                dispatch(actionSuccess("Task updated successfully"));
                dispatch(getTasks(user.role, user.email));
            } catch {
                dispatch(
                    actionFailed({ code: "500", message: "Update task failed" })
                );
            }
        };
