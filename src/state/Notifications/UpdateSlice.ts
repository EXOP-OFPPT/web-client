import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
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
    status: string;
    createdAt: Timestamp;
    deadLine: Timestamp;
    assignedTo: string;
    kpiCode: string;
};


// Interface for User action payload
interface UpdatedTaskPayload {
    id: string;
    updatedData: any;
    user: {
        role: string;
        email: string;
    }
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


export const updateTask =
    ({ id, updatedData, user }: UpdatedTaskPayload): AppThunk =>
        async (dispatch) => {
            // Reset message and error
            dispatch(setLoading(true));
            dispatch(clearMessageAndError());
            try {
                console.log("Updating task");
                const ref = doc(db, "tasks", id);
                await updateDoc(ref, updatedData);
                dispatch(actionSuccess("Task updated successfully"));
                dispatch(getTasks(user.role, user.email));
            } catch {
                dispatch(
                    actionFailed({ code: "500", message: "Update task failed" })
                );
            }
        };
