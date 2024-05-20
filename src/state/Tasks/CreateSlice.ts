import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, store } from "../store";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getTasks } from "./GetSlice";
import { updateAvailableBonus } from "../Kpis/UpdateSlice";
import { getKpis } from "../Kpis/GetSlice";

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
  bonus: number;
  createdAt: Timestamp;
  deadLine: Timestamp;
  completedAt?: Timestamp | undefined;
  assignedTo: string;
  kpiCode: string;
};


interface taskPayload {
  docId: string;
  taskData: taskType;
  user: {
    role: string;
    email: string;
  };
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

export const createTask =
  ({ docId, taskData, user }: taskPayload): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      // Check if kpi already exist
      await dispatch(checkTaskExist(docId, setTaskExist));
      if (!store.getState().createKpi.kpiExist) {
        console.log("Creating Task");
        //! Add a new document with account id.
        await setDoc(doc(db, "tasks", docId), {
          ...taskData,
        }).then(() => {
          dispatch(updateAvailableBonus({ code: taskData.kpiCode, bonus: (-taskData.bonus), user: user }));
          dispatch(actionSuccess("Task created successfully"));
          dispatch(getTasks(user.role, user.email));
          dispatch(getKpis());
          dispatch(setLoading(false));
        })
      } else {
        dispatch(
          actionFailed({ code: "500", message: "Task already exists" })
        );
      }
    };
