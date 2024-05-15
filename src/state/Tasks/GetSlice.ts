import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store';
import { collection, DocumentData, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";


// Interface for error
interface Error {
    code: string;
    message: string;
}

export type TaskType = {
    id: string;
    title: string;
    description: string;
    status: "todo" | "inprogress" | "done" | "verified";
    bonus: number;
    assignedTo: string;
    createdAt: Timestamp;
    deadLine: Timestamp;
    completedAt?: Timestamp;
    kpiCode: string;
};


// Interface for AuthState
interface tasksState {
    tasks: TaskType[] | [];
    loading: boolean;
    error: Error | null;
    message: string | null;
}


// Initial state
const initialState: tasksState = {
    tasks: [],
    loading: false,
    error: null,
    message: null,
};




// Create slice
const getTasksSlice = createSlice({
    name: "getTasksSlice",
    initialState,
    reducers: {
        actionSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.tasks = action.payload;
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
    },
});

export const { actionSuccess, actionFailed, setLoading, setMessage, clearMessageAndError } = getTasksSlice.actions;

export default getTasksSlice.reducer;

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
export const getTasks = (role: string, email: string): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());
    try {
        if (role === "admin") {
            // Get all tasks
            const querySnapshot = await getDocs(collection(db, "tasks"));
            const tasks: DocumentData = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const data = doc.data();
                tasks.push({
                    ...data,
                    createdAt: data.createdAt.toDate().toISOString(),
                    deadLine: data.deadLine.toDate().toISOString(),
                    completedAt: data.completedAt ? data.completedAt.toDate().toISOString() : undefined,
                });
            });
            dispatch(actionSuccess(tasks));
        } else {
            // Get all tasks assigned to the user
            const q = query(collection(db, "tasks"), where("assignedTo", "==", email));
            const querySnapshot = await getDocs(q);
            const tasks: DocumentData = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const data = doc.data();
                tasks.push({
                    ...data,
                    createdAt: data.createdAt.toDate().toISOString(),
                    deadLine: data.deadLine.toDate().toISOString(),
                    completedAt: data.completedAt ? data.completedAt.toDate().toISOString() : undefined,
                });
            });
            dispatch(actionSuccess(tasks));
        }
    } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
};


// Async action creator
export const getKpiTasks = (kpiCode: string): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());
    try {
        // Get all tasks assigned to the user
        const q = query(collection(db, "tasks"), where("kpiCode", "==", kpiCode));
        const querySnapshot = await getDocs(q);
        const tasks: DocumentData = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const data = doc.data();
            tasks.push({
                ...data,
                createdAt: data.createdAt.toDate().toISOString(),
                deadLine: data.deadLine.toDate().toISOString(),
                completedAt: data.completedAt ? data.completedAt.toDate().toISOString() : undefined,
            });
        });
        dispatch(actionSuccess(tasks));
    } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
};





