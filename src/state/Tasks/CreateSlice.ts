import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, store } from "../store";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getEmployeeTasks, getKpiTasks, getTasks } from "./GetSlice";
import { getKpis } from "../Kpis/GetSlice";
import { updateContribution } from "../Employees/UpdateSlice";

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
  deadLine: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp | undefined;
  assignedTo: string;
  kpiCode: string;
};


interface taskPayload {
  docId: string;
  contribute: string;
  taskData: taskType;
  from: string;
  email: string;
}

interface CreateState {
  task: taskType | {};
  loading: boolean;
  error: Error | null;
  message: string | null;
  taskExist: any;
}

// Initial state
const initialState: CreateState = {
  task: {},
  loading: false,
  error: null,
  message: null,
  taskExist: null,
};

// Create slice
const createTaskSlice = createSlice({
  name: "createTaskSlice",
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
    setTaskExist: (state, action: PayloadAction<any>) => {
      state.taskExist = action.payload;
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
  setTaskExist,
} = createTaskSlice.actions;

export default createTaskSlice.reducer;

export const checkTaskExist =
  (docId: string, setAction: Function): AppThunk =>
    async (dispatch) => {
      try {
        const docRef = doc(db, "kpis", docId);
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

export const createTask =
  ({ docId, contribute, taskData, from, email }: taskPayload): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      // Check if kpi already exist
      await dispatch(checkTaskExist(docId, setTaskExist));
      if (!store.getState().createKpi.kpiExist) {
        console.log("Creating Task");
        //! Add a new document with account id.
        setDoc(doc(db, "tasks", docId), {
          ...taskData,
        }).then(() => {
          dispatch(updateContribution({ email, contribute }));
          dispatch(actionSuccess("Task created successfully"));
          dispatch(getKpis());
          if (from === "tasks") {
            dispatch(getTasks());
          }
          else if ((from === "myTasks") && email) {
            dispatch(getEmployeeTasks(email));
          }
          else if (from === "kpiTasks") {
            dispatch(getKpiTasks(taskData.kpiCode));
          }
          dispatch(setLoading(false));
        }).catch((error) => {
          dispatch(actionFailed({ code: "500", message: error.message }));
        });
      } else {
        dispatch(
          actionFailed({ code: "500", message: "Task already exists" })
        );
      }
    };
