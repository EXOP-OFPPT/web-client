import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getTasks } from "./GetSlice";

// Interface for error
interface Error {
    code: string;
    message: string;
}

export type taskType = {
    id: string;
    title: string;
    description: string;
    status: "todo" | "inprogress" | "done";
    createdAt: string;
    deadLine: string;
    assignedTo: string;
    idKpi: string;
};


// Interface for User action payload
interface UpdatedKpiPayload {
    code: string;
    updatedData: taskType;
}

// Interface for AuthState
interface UpdateState {
    task: taskType | {};
    loading: boolean;
    error: Error | null;
    message: string | null;
}

// Initial state
const initialState: UpdateState = {
    task: {},
    loading: false,
    error: null,
    message: null,
};

// Create slice
const updateTaskSlice = createSlice({
    name: "updateTaskSlice",
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
} = updateTaskSlice.actions;

export default updateTaskSlice.reducer;


export const updateKpi =
    ({ code, updatedData }: UpdatedKpiPayload): AppThunk =>
        async (dispatch) => {
            // Reset message and error
            dispatch(setLoading(true));
            dispatch(clearMessageAndError());
            try {
                console.log("Updating task");
                const ref = doc(db, "task", code);
                await updateDoc(ref, updatedData);
                dispatch(actionSuccess("task updated successfully"));
                dispatch(getTasks());
            } catch {
                dispatch(
                    actionFailed({ code: "500", message: "Update task failed" })
                );
            }
        };
