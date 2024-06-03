import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, store } from '../store';
import { auth, db } from '@/firebase/firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from "firebase/auth";
import Cookies from 'universal-cookie';
import { collection, deleteDoc, doc, DocumentData, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import CryptoJS from 'crypto-js';


const cookies = new Cookies(null, { path: '/' });


// Interface for login action payload
interface LoginPayload {
  email: string;
  password: string;
  type: 'first' | 'already';
}

interface UserProfileState {
  uid?: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: string;
}

// Interface for error
interface Error {
  code: string;
  message: string;
}

// Interface for AuthState
interface AuthState {
  user: any,
  isLogin: boolean;
  isLoading: boolean;
  message: string | null;
  error: Error | null;
}


// Initial state
const initialState: AuthState = {
  user: null,
  isLogin: false,
  isLoading: false,
  message: null,
  error: null,
};

// Create slice
const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    actionSuccess: (state) => {
      state.isLogin = true;
      state.isLoading = false;
      state.error = null;
    },
    actionFailed: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<DocumentData | UserProfileState | null>) => {
      state.user = action.payload ? { ...state.user, ...action.payload } : null;
    },
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload;
    },
    clearMessageAndError: (state) => {
      state.message = null;
      state.error = null;
    },
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
    },
  },
});

export const { actionSuccess, actionFailed, setUser, setLoading, setMessage, clearMessageAndError, logout } = Auth.actions;

export default Auth.reducer;

//! Async action creator
// export const observeAuthState = (): AppThunk => dispatch => {
//   onAuthStateChanged(auth, user => {
//     console.log("User: ", user)
//     if (user) {
//       dispatch(actionSuccess(user.providerData[0]));
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
      dispatch(setUser(docSnap.data()));
    } else {
      // docSnap.data() will be undefined in this case
      dispatch(setUser(null));
    }
  } catch (error: any) {
    dispatch(setUser(null));;
  }
}

export const getUserProfile = (): AppThunk => async dispatch => {
  try {
    const user = auth.currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;
      // const uid = user.uid;
      dispatch(setUser({ email, displayName, photoURL, emailVerified }));
    }
  } catch (error: any) {
    dispatch(actionFailed({ code: "500", message: error }));
  }
}
const deleteFile = (fileName: string): AppThunk =>
  async () => {
    const storage = getStorage();
    // Create a reference to the file to delete
    const desertRef = ref(storage, `Avatars/${fileName}`);
    deleteObject(desertRef).then(() => {
      console.log("File deleted successfully");
    }).catch((error: any) => {
      console.log({ code: error.code, message: error.message });
    });
  };


export const updatePhotoProfile = (photoURL: string, photoName: string, currentEmail: string): AppThunk => async dispatch => {
  try {
    dispatch(clearMessageAndError())
    const user = auth.currentUser;
    if (user !== null) {
      await updateProfile(user, {
        photoURL
      }).then(async () => {
        const ref = doc(db, "employees", currentEmail);
        await getDoc(ref).then(async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data.avatar) {
              // Delete the existing image
              dispatch(deleteFile(data.avatar.photoName))
            }
          }
        });
        await updateDoc(ref, { avatar: { photoURL, photoName }, }).then(async () => {
          // get the updated user profile
          await dispatch(checkUserExist(currentEmail));
          await dispatch(getUserProfile());
          const state = store.getState();
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7);
          cookies.set('user', JSON.stringify(state.auth.user), { path: '/', expires: expiryDate });
        })
      }).catch((error) => {
        dispatch(actionFailed({ code: error.code, message: error.message }));
      });
    }
  } catch (error: any) {
    dispatch(actionFailed({ code: error.code, message: error.message }));
  }
};


// Async action creator
export const login = ({ email, password, type }: LoginPayload): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  dispatch(clearMessageAndError())

  await dispatch(checkUserExist(email));
  if (type == 'already') {
    // Hash the password to check
    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY as string;
    const bytes = CryptoJS.AES.decrypt(password, SECRET_KEY);
    password = bytes.toString(CryptoJS.enc.Utf8);
  }
  if (store.getState().auth.user) {
    console.log(email, password)

    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        dispatch(getUserProfile());
        if (store.getState().auth.error) {
          throw new Error("Failed to get user profile");
        }
        const state = store.getState();
        if (!cookies.get("user")) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7); // Set the date to 7 days in the future

          // Encrypt the password
          const SECRET_KEY = import.meta.env.VITE_SECRET_KEY as string;
          const EHP = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
          console.log(EHP)
          // Store the encrypted password in a cookie
          cookies.set('EHP', EHP, { path: '/', expires: expiryDate });
          cookies.set('user', JSON.stringify(state.auth.user), { path: '/', expires: expiryDate });
        }
        dispatch(actionSuccess());
        dispatch(setMessage("User logged in successfully!"));
      })
      .catch((error: any) => {
        dispatch(setLoading(false));
        dispatch(actionFailed({ code: error.code, message: error.message }));
      });
  } else {
    dispatch(setLoading(false));
    dispatch(actionFailed({ code: "500", message: "User not found" }));
  }
};

// Async action creator
export const logoutUser = (): AppThunk => async dispatch => {
  try {
    dispatch(clearMessageAndError())
    await signOut(auth).then(() => {
      cookies.remove('EHP', { path: '/' });
      cookies.remove('user', { path: '/' });
      dispatch(logout());
    });
  } catch (error: any) {
    dispatch(actionFailed({ code: error.code, message: error.message }));
  }
};


// Async action creator
export const resetPassword = (email: string): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  dispatch(clearMessageAndError())
  sendPasswordResetEmail(auth, email)
    .then(() => {
      dispatch(setLoading(false));
      dispatch(setMessage("Password reset email sent!"))
    })
    .catch((error) => {
      dispatch(setLoading(false));
      dispatch(actionFailed({ code: error.code, message: error.message }));
    });
};


// Function to update password
export const updateAccountPassword = (newPassword: string): AppThunk => async dispatch => {
  try {
    const user = auth.currentUser;
    if (user !== null) {
      updatePassword(user, newPassword).then(() => {
        dispatch(setMessage("Password updated successfully!"));
      })
        .catch((error) => {
          dispatch(actionFailed({ code: error.code, message: error.message }));
        });
    }
  } catch (error: any) {
    dispatch(actionFailed({ code: error.code, message: error.message }));
  }
};

// Function to delete account, employee document, and contributes subcollection
export const deleteAccountAndDocument = (): AppThunk => async dispatch => {
  try {
    const user = auth.currentUser;
    if (user !== null) {
      // Get the employee document reference
      const docRef = doc(db, "employees", user.email as string);

      // Get the contributes subcollection
      const contributesCollection = collection(docRef, "contributions");

      // Get all the documents in the contributes subcollection
      const contributesSnapshot = await getDocs(contributesCollection);

      // Delete each document in the contributes subcollection
      // Delete each document in the contributes subcollection
      contributesSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });

      // Delete the employee document
      deleteDoc(docRef).then(async () => {
        dispatch(setMessage("Employee and contributes deleted successfully"));

        // Delete the user account
        user.delete()
          .then(() => {
            dispatch(logoutUser());
          })
          .catch((error) => {
            dispatch(actionFailed({ code: error.code, message: error.message }));
          });
      }).catch((error) => {
        dispatch(actionFailed({ code: error.code, message: error.message }));
      });
    }
  } catch (error: any) {
    dispatch(actionFailed({ code: error.code, message: error.message }));
  }
};


