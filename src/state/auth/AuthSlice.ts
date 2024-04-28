import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../store';
import { auth } from '@/firebase/firebase';
import { signInWithEmailAndPassword, signOut} from "firebase/auth";
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });


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
  isLoading: boolean;
  error: Error | null;
}


// Initial state
const initialState: AuthState = {
  isLogin: false,
  user: null,
  isLoading:false,
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
      // state.isLoading = false;
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
    },
    setLoading:(state) => {
      state.isLoading = true;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, setLoading, loginFailed, logout } = Auth.actions;

export default Auth.reducer;

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
export const login = ({ email, password }: LoginPayload): AppThunk => async dispatch => {
  try {
    console.log("gg")
    dispatch(setLoading);
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      dispatch(loginSuccess(user.providerData[0]));
    })
    .catch((error: any) => {
      dispatch(loginFailed({ code: error.code, message: error.message }));
    });
  } catch (error: any) {
    dispatch(loginFailed({ code: error.code, message: error.message }));
  }
};

// Async action creator
export const logoutUser = (): AppThunk => async dispatch => {
  try {
    await signOut(auth);
    cookies.remove('isLoggedIn', { path: '/' });
    dispatch(logout());
  } catch (error: any) {
    dispatch(loginFailed({ code: error.code, message: error.message }));
  }
};
