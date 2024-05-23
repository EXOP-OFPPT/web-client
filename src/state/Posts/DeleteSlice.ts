import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { collection, deleteDoc, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getPosts } from "./GetSlice";
import { deleteObject, getStorage, ref } from "firebase/storage";

// Interface for error
interface Error {
  code: string;
  message: string;
}

interface DeletePyload {
  docId: string;
  fileName: string
}


// Interface for DeleteState
interface DeleteState {
  loading: boolean;
  error: Error | null;
  message: string | null;
}

// Initial state
const initialState: DeleteState = {
  loading: false,
  error: null,
  message: null,
};

// Create slice
const deletePostSlice = createSlice({
  name: "deletePostSlice",
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
} = deletePostSlice.actions;

export default deletePostSlice.reducer;


const deleteFile = (fileName: string): AppThunk =>
  async (dispatch) => {
    const storage = getStorage();
    // Create a reference to the file to delete
    const desertRef = ref(storage, `Posts/Images/${fileName}`);
    deleteObject(desertRef).then(() => {
      dispatch(actionSuccess(" Post file deleted successfully"));
    }).catch((error: any) => {
      dispatch(actionFailed({ code: error.code, message: error.message }));
    });
  };

export const deletePost =
  ({ docId, fileName }: DeletePyload): AppThunk =>
    async (dispatch) => {
      console.log(docId, fileName);
      // Reset message and error
      dispatch(setLoading(true));
      dispatch(clearMessageAndError());
      try {
        // Get reference to the comments subcollection
        const commentsRef = collection(db, "posts", docId, "comments");

        // Get all comments
        const commentsSnapshot = await getDocs(commentsRef);

        // Delete all comments
        const batch = writeBatch(db);
        commentsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        // Delete the post
        deleteDoc(doc(db, "posts", docId)).then(() => {
          dispatch(deleteFile(fileName))
          dispatch(actionSuccess("Post deleted successfully"));
          dispatch(getPosts());
        }).catch((error: any) => {
          dispatch(actionFailed({ code: error.code, message: error.message }));
        });
      } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
      }
    };
