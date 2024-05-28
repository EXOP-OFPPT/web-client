import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getEmployeeTasks, getKpiTasks, getTasks } from "./GetSlice";

// Interface for error
interface Error {
    code: string;
    message: string;
}

export type taskType = {
    id: string;
    title: string;
    probleme: string;
    status: string;
    createdAt: Timestamp;
    deadLine: Timestamp;
    completedAt?: Timestamp;
    assignedTo: string;
    kpiCode: string;
};


// Interface for User action payload
interface UpdatedTaskPayload {
    id: string;
    updatedData: any;
    from: string;
    email?: string;
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
    ({ id, updatedData, from, email }: UpdatedTaskPayload): AppThunk =>
        async (dispatch) => {
            // Reset message and error
            dispatch(setLoading(true));
            dispatch(clearMessageAndError());
            console.log("Updating task");
            const ref = doc(db, "tasks", id);
            updateDoc(ref, updatedData).then(() => {
                dispatch(actionSuccess("Task updated successfully"));
                if (from === "tasks") {
                    dispatch(getTasks());
                }
                else if ((from === "myTasks") && email) {
                    dispatch(getEmployeeTasks(email));
                }
                else if ((from === "kpiTasks")) {
                    dispatch(getKpiTasks(updatedData.kpiCode));
                }
            }).catch((error:any) => {
                dispatch(
                    actionFailed({ code: "500", message: error.message })
                );
            });
        };


