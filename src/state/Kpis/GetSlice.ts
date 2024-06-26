import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store';
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";


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
};


// Interface for AuthState
interface KpisState {
    kpis: KpiType[] | [];
    loading: boolean;
    error: Error | null;
    message: string | null;
    kpiExist: any;
}


// Initial state
const initialState: KpisState = {
    kpis: [],
    loading: false,
    error: null,
    message: null,
    kpiExist: null,
};




// Create slice
const getKpisSlice = createSlice({
    name: "getKpisSlice",
    initialState,
    reducers: {
        actionSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.kpis = action.payload;
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
        setKpiExist: (state, action: PayloadAction<any>) => {
            state.kpiExist = action.payload;
        }
    },
});

export const { actionSuccess, actionFailed, setLoading, setMessage, clearMessageAndError, setKpiExist } = getKpisSlice.actions;

export default getKpisSlice.reducer;

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
export const getKpis = (): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());
    try {
        // Get all kpis
        const querySnapshot = await getDocs(collection(db, "kpis"));
        const kpis: DocumentData = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            kpis.push(doc.data());
        });
        dispatch(actionSuccess(kpis));
    } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
};

