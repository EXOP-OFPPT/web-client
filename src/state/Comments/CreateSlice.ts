import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getComments } from "./GetSlice";

// Interface for error
interface Error {
  code: string;
  message: string;
}

export type CommentType = {
  createdAt: Timestamp;
  id: string;
  content: string;
  sender: string;
};


interface CommentPayload {
  postId: string;
  docId: string;
  content: string;
  sender: string;
}

interface CreateState {
  Comment: CommentType | {};
  loading: boolean;
  error: Error | null;
  message: string | null;
}

// Initial state
const initialState: CreateState = {
  Comment: {},
  loading: false,
  error: null,
  message: null,
};

// Create slice
const createCommentSlice = createSlice({
  name: "createCommentSlice",
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
} = createCommentSlice.actions;

export default createCommentSlice.reducer;


export const createComment =
  ({ postId, docId, sender, content }: CommentPayload): AppThunk =>
    async (dispatch) => {
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      try {
        const commentPath = `posts/${postId}/comments/${docId}`;
        const commentRef = doc(db, commentPath);
        await setDoc(commentRef,
          {
            id: docId,
            content,
            sender,
            createdAt: Timestamp.now(),
          }
        );
        // Dispatch success action
        dispatch(actionSuccess('Comment created successfully'));
        dispatch(getComments(postId));
      } catch (error: any) {
        // Dispatch error action
        dispatch(actionFailed({ code: "500", message: error.message }));
      } finally {
        dispatch(setLoading(false));
      }

    };
