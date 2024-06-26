import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getKpis } from "./GetSlice";
import { updateContribution } from "../Employees/UpdateSlice";

// Interface for error
interface Error {
    code: string;
    message: string;
}

type KpiType = {
    code?: string;
    title?: string;
    description?: string;
    minTaux?: number;
    currentTaux?: number;
    type?: string;
};


// Interface for User action payload
interface UpdatedKpiPayload {
    code: string;
    contribute: string;
    email: string;
    updatedData: KpiType;
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
                const docRef = doc(db, "kpis", docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    dispatch(setAction(docSnap.data()));
                } else {
                    dispatch(setAction(null));
                }
            } catch (error: any) {
                dispatch(setAction(null));
            }
        };

export const updateKpi =
    ({ code, contribute, email, updatedData }: UpdatedKpiPayload): AppThunk =>
        async (dispatch) => {
            // Reset message and error
            dispatch(setLoading(true));
            dispatch(clearMessageAndError());
            try {
                const ref = doc(db, "kpis", code);
                updateDoc(ref, updatedData).then(() => {
                    dispatch(updateContribution({ email, contribute }));
                    dispatch(actionSuccess("Kpi updated successfully"));
                    dispatch(getKpis());
                }).catch((error: any) => {
                    dispatch(actionFailed({ code: error.code, message: error.message }));
                });
            } catch {
                dispatch(
                    actionFailed({ code: "500", message: "Update failed" })
                );
            }
        };

