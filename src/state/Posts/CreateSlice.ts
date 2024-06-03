import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebase";

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

type Avatar = {
  photoURL: string;
  photoName: string;
}

type User = {
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

type PostType = {
  title: string;
  attachement: Attachment;
  sender: string;
  createdAt?: string;
  id: string;
  description: string;
  likes: number;
  comments?: Comment[];
  poster?: User;
};



interface CreateState {
  post: PostType | {};
  loading: boolean;
  error: Error | null;
  message: string | null;
  progress: number;
}

// Initial state
const initialState: CreateState = {
  post: {},
  loading: false,
  error: null,
  message: null,
  progress: 0,
};



export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: PostType) => {
    console.log(postData)
    try {
      const postRef = doc(db, "posts", postData.id);
      await setDoc(postRef, {
        ...postData,
        createdAt: Timestamp.now(),
      });
    } catch (error: any) {
      throw error;
    }
  }
);

// Create slice
const createPostSlice = createSlice({
  name: "createPostSlice",
  initialState,
  reducers: {
    clearMessageAndError: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false;
        state.message = "Post created successfully";
      })
      .addCase(createPost.rejected, (state) => {
        state.loading = false;
        state.error = { code: "500", message: "Failed to create post" };
      });
  }
});

export const {
  clearMessageAndError,
} = createPostSlice.actions;

export default createPostSlice.reducer;
