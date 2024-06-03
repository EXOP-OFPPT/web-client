import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
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


// Interface for User action payload
interface UpdatedEventPayload {
    id: string;
    updatedData: any;
    contribute: string;
    email: string;
}

// Interface for AuthState
interface UpdateState {
    event: EventType | {};
    loading: boolean;
    error: Error | null;
    message: string | null;
}

// Initial state
const initialState: UpdateState = {
    event: {},
    loading: false,
    error: null,
    message: null,
};

// Create slice
const updateEventSlice = createSlice({
    name: "updateEventSlice",
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
} = updateEventSlice.actions;

export default updateEventSlice.reducer;


export const updateEvent =
    ({ id, updatedData, contribute, email }: UpdatedEventPayload): AppThunk =>
        async (dispatch) => {
            // Reset message and error
            dispatch(setLoading(true));
            dispatch(clearMessageAndError());
            try {
                console.log("Updating event");
                const ref = doc(db, "events", id);
                await updateDoc(ref, updatedData).then(() => {
                    dispatch(updateContribution({ email, contribute }));
                    dispatch(actionSuccess("Event updated successfully"));
                    dispatch(getEvents());
                }).catch((error) => {
                    dispatch(actionFailed({ code: error.code, message: error.message }));
                })
            } catch {
                dispatch(
                    actionFailed({ code: "500", message: "Update event failed" })
                );
            }
        };
