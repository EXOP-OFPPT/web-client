import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store';
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { formatDistanceToNow } from "date-fns";


// Interface for error
interface Error {
    code: string;
    message: string;
}

type Attachment = {
    type: string;
    fileName: string;
    url: string;
};

export type User = {
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    avatar: string;
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
    comments: Comment[];
    commentsCount: number;
    poster: User;
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
const getPostsSlice = createSlice({
    name: "getPostsSlice",
    initialState,
    reducers: {
        actionSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.posts = action.payload;
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

export const { actionSuccess, actionFailed, setLoading, setMessage, clearMessageAndError } = getPostsSlice.actions;

export default getPostsSlice.reducer;

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



export const getPosts = (): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    dispatch(clearMessageAndError());
    try {
        const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(postsQuery);
        const postsPromises = querySnapshot.docs.map(async (currentDoc) => {
            const postData = currentDoc.data();
            const userRef1 = doc(db, "employees", postData.sender);
            const userDoc1 = await getDoc(userRef1);
            const poster = userDoc1.data();

            // Get the count of comments
            const commentsQuery = query(collection(db, "posts", currentDoc.id, 'comments'));
            const commentsSnapshot = await getDocs(commentsQuery);
            const commentsCount = commentsSnapshot.size;

            const postCreatedAt = postData.createdAt.toDate();
            const postTimeAgo = formatDistanceToNow(postCreatedAt, { addSuffix: true });
            return {
                ...postData,
                createdAt: postData.createdAt.toDate().toISOString(),
                timeAgo: postTimeAgo,
                commentsCount, // Add the count of comments
                poster,
            };
        });
        const posts = await Promise.all(postsPromises);
        dispatch(actionSuccess(posts));
    } catch (error: any) {
        dispatch(actionFailed({ code: error.code, message: error.message }));
    } finally {
        dispatch(setLoading(false));
    }
};


