import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store';
import { collection, doc, getDocs, query, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";


// Interface for error
interface Error {
    code: string;
    message: string;
}

export type User = {
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    avatar: string;
    email: string;
};

export type CommentType = {
    createdAt: Timestamp | string;
    id: string;
    content: string;
    sender: string;
    timeAgo?: string;
    commenter?: User;
};


// Interface for AuthState
interface CommentsState {
    comments: CommentType[] | [];
    loading: boolean;
    error: Error | null;
    message: string | null;
}


// Initial state
const initialState: CommentsState = {
    comments: [],
    loading: false,
    error: null,
    message: null,
};




// Create slice
const getCommentsSlice = createSlice({
    name: "getCommentsSlice",
    initialState,
    reducers: {
        actionSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.comments = action.payload;
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

export const { actionSuccess, actionFailed, setLoading, setMessage, clearMessageAndError } = getCommentsSlice.actions;

export default getCommentsSlice.reducer;

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



// get comments for a post id
export const getComments = (postId: string): AppThunk => async (dispatch) => {
    // Reset message and error
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());

    // Get all comments for a post
    // Get a reference to the post document
    const postRef = doc(db, 'posts', postId);

    // Get a reference to the comments subcollection
    const commentsRef = collection(postRef, 'comments');

    // Create a query to get all comments
    const q = query(commentsRef);

    try {
        const querySnapshot = await getDocs(q);
        const comments: CommentType[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as CommentType;
            if (data.createdAt instanceof Timestamp) {
                data.createdAt = data.createdAt.toDate().toISOString();
            }
            comments.push(data); // push the modified data object
        });
        dispatch(actionSuccess(comments));
    } catch (error: any) {
        dispatch(actionFailed({ code: "500", message: error.message }));
    }
};





