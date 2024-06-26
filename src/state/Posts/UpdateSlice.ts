import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getPosts } from "./GetSlice";


// Interface for error
interface Error {
    code: string;
    message: string;
}

interface UpdatedPostPayload {
    id: string;
    updatedData: any;
}

type Attachment = {
    type: string;
    fileName: string;
    url: string;
};

type Avatar = {
    photoURL: string;
    photoName: string;
}

export type User = {
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    avatar: Avatar;
    email: string;
};

type Comment = {
    createdAt: string;
    id: string;
    content: string;
    sender: string;
    timeAgo?: string;
    commenter?: User;
};

export type PostType = {
    title: string;
    attachement: Attachment;
    sender: string;
    createdAt: string;
    id: string;
    description: string;
    likes: number;
    timeAgo?: string;
    comments?: Comment[];
    poster?: User;
};


// Interface for AuthState
interface PostsState {
    posts: PostType[] | [];
    loading: boolean;
    error: Error | null;
    message: string | null;
}

// Initial state
const initialState: PostsState = {
    posts: [],
    loading: false,
    error: null,
    message: null,
};


// Create slice
const updatePostSlice = createSlice({
    name: "updatePostSlice",
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
} = updatePostSlice.actions;

export default updatePostSlice.reducer;




export const addLike = (postId: string, like: number): AppThunk => async dispatch => {
    dispatch(clearMessageAndError());

    const postRef = doc(db, 'posts', postId);

    updateDoc(postRef, {
        likes: increment(like)
    }).then(() => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        if (like === 1) {
            likedPosts.push(postId);
        } else if (like === -1) {
            const index = likedPosts.indexOf(postId);
            if (index !== -1) {
                likedPosts.splice(index, 1);
            }
        }
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        dispatch(actionSuccess('Successfully updated like'));
    }).catch((error: any) => {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    })
};



export const updatePost =
    ({ id, updatedData }: UpdatedPostPayload): AppThunk =>
        async (dispatch) => {
            // Reset message and error
            dispatch(setLoading(true));
            dispatch(clearMessageAndError());
            try {
                const ref = doc(db, "tasks", id);
                await updateDoc(ref, updatedData);
                dispatch(actionSuccess("Task updated successfully"));
                dispatch(getPosts());
            } catch {
                dispatch(
                    actionFailed({ code: "500", message: "Update task failed" })
                );
            }
        };
