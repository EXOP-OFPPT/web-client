import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, store } from "../store";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getKpis } from "./GetSlice";
import { updateContribution } from "../Employees/UpdateSlice";

// Interface for error
interface Error {
  code: string;
  message: string;
}

type KpiType = {
  code: string;
  title: string;
  description: string;
  minTaux: number;
  currentTaux: number;
};


// Interface for User action payload
interface kpiPayload {
  docId: string;
  contribute: string;
  email: string;
  kpiData: KpiType;
}

// Interface for AuthState
interface CreateState {
  kpi: KpiType | {};
  loading: boolean;
  error: Error | null;
  message: string | null;
  kpiExist: any;
}

// Initial state
const initialState: CreateState = {
  kpi: {},
  loading: false,
  error: null,
  message: null,
  kpiExist: null,
};

// Create slice
const createKpiSlice = createSlice({
  name: "createKpiSlice",
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
      state.kpiExist = action.payload;
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
} = createKpiSlice.actions;

export default createKpiSlice.reducer;

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
          // docSnap.data() will be undefined in this case
          dispatch(setAction(null));
        }
      } catch (error: any) {
        dispatch(setAction(null));
      }
    };

export const createKpi =
  ({ docId, contribute, email, kpiData }: kpiPayload): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      // Check if user already exist
      await dispatch(checkKpiExist(docId, setKpiExist));
      if (!store.getState().createKpi.kpiExist) {
        setDoc(doc(db, "kpis", docId), {
          ...kpiData,
        }).then(() => {
          dispatch(updateContribution({ email, contribute }));
          dispatch(actionSuccess("Kpi created successfully"));
          dispatch(getKpis());
          dispatch(setLoading(false));
        }).catch((error) => {
          dispatch(actionFailed({ code: "500", message: error.message }));
        });
      } else {
        dispatch(
          actionFailed({ code: "500", message: "Kpi already exists" })
        );
      }
    };
