import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, store } from '../store';
import { auth, db } from '@/firebase/firebase';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Cookies from 'universal-cookie';
import { doc, getDoc } from "firebase/firestore";

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
  user: any;
  isLogin: boolean;
  isLoading: boolean;
  error: Error | null;
}


// Initial state
const initialState: AuthState = {
  user: null,
  isLogin: false,
  isLoading: false,
  error: null,
};

// Create slice
const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state) => {
      cookies.set('isLoggedIn', 'true', { path: '/' });
      state.isLogin = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserExists: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, loginFailed, setUserExists, setLoading, logout } = Auth.actions;

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


export const checkUserExist = (docId: string): AppThunk => async dispatch => {
  try {
    const docRef = doc(db, "employees", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      dispatch(setUserExists(docSnap.data()));
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      dispatch(setUserExists(null));
    }
  } catch (error: any) {
    dispatch(setUserExists(null));;
  }
}

// Async action creator
export const login = ({ email, password }: LoginPayload): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  await dispatch(checkUserExist(email));
  if (store.getState().auth.user) {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);
        dispatch(loginSuccess());
      })
      .catch((error: any) => {
        dispatch(setLoading(false));
        dispatch(loginFailed({ code: error.code, message: error.message }));
      });
  } else {
    dispatch(setLoading(false));
    dispatch(loginFailed({ code: "500", message: "User Credential is not valid" }));
  }
};

// Async action creator
export const logoutUser = (): AppThunk => async dispatch => {
  try {
    await signOut(auth);
    cookies.remove('isLoggedIn', { path: '/' });
    dispatch(setLoading(false));
    dispatch(logout());
  } catch (error: any) {
    dispatch(loginFailed({ code: error.code, message: error.message }));
  }
};
