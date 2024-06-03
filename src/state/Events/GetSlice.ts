import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store';
import { collection, DocumentData, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";


// Interface for error
interface Error {
    code: string;
    message: string;
}

export type LocationType = {
    type: "physical" | "virtual";
    address: string;
};

export type GuestType = {
    email: string;
    avatar: string;
    firstName: string;
    lastName: string;
};

export type EventType = {
    id: string;
    title: string;
    description: string;
    location: LocationType;
    createdAt: Timestamp;
    startedAt: Timestamp;
    guests: GuestType[] | [];
};


// Interface for AuthState
interface eventsState {
    events: EventType[] | [];
    loading: boolean;
    error: Error | null;
    message: string | null;
}


// Initial state
const initialState: eventsState = {
    events: [],
    loading: false,
    error: null,
    message: null,
};




// Create slice
const getEventsSlice = createSlice({
    name: "getEventsSlice",
    initialState,
    reducers: {
        actionSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.events = action.payload;
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

export const { actionSuccess, actionFailed, setLoading, setMessage, clearMessageAndError } = getEventsSlice.actions;

export default getEventsSlice.reducer;

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
export const getEvents = (): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());
    try {
        // Get all events
        const querySnapshot = await getDocs(query(collection(db, "events"), orderBy("startedAt", "desc"))); const events: DocumentData = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const data = doc.data();
            events.push({
                ...data,
                createdAt: data.createdAt.toDate().toISOString(),
                startedAt: data.startedAt.toDate().toISOString(),
            });
        });
        dispatch(actionSuccess(events));
    } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
};

