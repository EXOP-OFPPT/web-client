import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getEvents } from "./GetSlice";
import { updateContribution } from "../Employees/UpdateSlice";

// Interface for error
interface Error {
  code: string;
  message: string;
}

type LocationType = {
  type: "physical" | "virtual";
  address: string;
};

export type GuestType = {
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
};

type EventType = {
  id: string;
  title: string;
  description: string;
  location: LocationType;
  createdAt: Timestamp;
  startedAt: Timestamp;
  guests: GuestType[] | [];
};


interface EventPayload {
  docId: string;
  eventData: EventType;
  contribute: string;
  email: string;
}

interface CreateState {
  event: EventType | {};
  loading: boolean;
  error: Error | null;
  message: string | null;
}

// Initial state
const initialState: CreateState = {
  event: {},
  loading: false,
  error: null,
  message: null,
};

// Create slice
const createEventSlice = createSlice({
  name: "createEventSlice",
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
} = createEventSlice.actions;

export default createEventSlice.reducer;


export const createEvent =
  ({ docId, eventData, contribute, email }: EventPayload): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      console.log("Creating Event");
      //! Add a new document with account id.
      await setDoc(doc(db, "events", docId), {
        ...eventData,
      }).then(() => {
        dispatch(updateContribution({ email, contribute }));
        dispatch(actionSuccess("Event created successfully"));
        dispatch(getEvents());
        dispatch(setLoading(false));
      }).catch((error) => {
        dispatch(actionFailed({ code: error.code, message: error.message }));
      });
    }
