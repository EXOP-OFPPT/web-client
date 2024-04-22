import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store'; // Import this from your store file
import { auth } from '@/firebase/firebase';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";



// Interface for login action payload
interface LoginPayload {
  email: string;
  password: string;
}

// Interface for error
interface Error {
  code: string;
  message: string;
}

// Interface for AuthState
interface AuthState {
  isLogin: boolean;
  user: any;
  error: Error | null;
}

// Initial state
const initialState: AuthState = {
  isLogin: false,
  user: null,
  error: null,
};

// Create slice
const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
      state.isLogin = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, loginFailed, logout } = Auth.actions;

export default Auth.reducer;

// Async action creator
export const login = ({ email, password }: LoginPayload): AppThunk => async dispatch => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user.providerData[0];
    dispatch(loginSuccess(user));
  } catch (error: any) {
    dispatch(loginFailed({ code: error.code, message: error.message }));
  }
};


// Async action creator
export const logoutUser = (): AppThunk => async dispatch => {
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error: any) {
    console.error("Error signing out: ", error);
  }
};