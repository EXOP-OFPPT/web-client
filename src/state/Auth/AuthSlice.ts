import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, store } from '../store';
import { auth, db } from '@/firebase/firebase';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from "firebase/auth";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { toast } from "@/components/ui/use-toast";


// Interface for login action payload
interface LoginPayload {
  email: string;
  password: string;
}

export interface UserInterface {
  matricule: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  avatar: { photoURL: string, photoName: string };
};

// Interface for error
interface Error {
  code: string;
  message: string;
}

// Interface for AuthState
interface AuthState {
  user: UserInterface | null,
  loading: boolean;
  message: string | null;
  error: Error | null;
}


// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  message: null,
  error: null,
};

// Create slice
const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    actionSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      toast({
        variant: "default",
        title: "Action dispatched",
        description: action.payload,
        className: "text-primary border-2 border-primary text-start",
      });
    },
    actionFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: action.payload.toString(),
        className: "text-error border-2 border-error text-start",
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<UserInterface>) => {
      state.user = action.payload;
    },
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload;
    },
    clearMessageAndError: (state) => {
      state.message = null;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { actionSuccess, actionFailed, setUser, setLoading, setMessage, clearMessageAndError, logout } = Auth.actions;

export default Auth.reducer;



// Async action creator
export const observeAuthState = (): AppThunk => dispatch => {
  onAuthStateChanged(auth, user => {
    console.log("User: ", user)
    dispatch(setLoading(true));
    if (user) {
      GetUserAccountInfo().then((user: UserInterface | undefined) => {
        dispatch(setLoading(false));
        dispatch(setUser(user as UserInterface));
        dispatch(actionSuccess("User logged in successfully!"));
      }).catch((error: any) => {
        dispatch(setLoading(false));
        dispatch(actionFailed(error.message));
      });
    } else {
      dispatch(setLoading(false));
      dispatch(logout());
    }
  });
};

const GetUserAccountInfo = async () => {
  if (auth.currentUser) {
    const docRef = doc(db, "employees", auth.currentUser.email as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data()
      const user: UserInterface = {
        matricule: data.matricule,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        role: data.role,
        avatar: data.avatar || { photoURL: "", photoName: "" }
      };
      return user as UserInterface;
    }
  }
}


// Async action creator
export const login = ({ email, password }: LoginPayload): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  try {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        GetUserAccountInfo().then((user: UserInterface | undefined) => {
          dispatch(setUser(user as UserInterface));
          dispatch(actionSuccess("User logged in successfully!"));
        })
          .catch((error: any) => {
            dispatch(actionFailed(error.message));
          });
      }).catch((error) => {
        dispatch(actionFailed(error.message));
      });
  } catch {
    dispatch(actionFailed("An error occurred while trying to login!"));
  }
}


// Async action creator
export const logoutUser = (): AppThunk => async dispatch => {
  try {
    await signOut(auth).then(() => {
      dispatch(logout());
      dispatch(actionSuccess("User logout successfully!"))
    });
  } catch (error: any) {
    dispatch(actionFailed(error.message));
  }
};


// Async action creator
export const resetPassword = (email: string): AppThunk => async dispatch => {
  dispatch(setLoading(true));
  sendPasswordResetEmail(auth, email)
    .then(() => {
      dispatch(actionSuccess("Password reset email sent!"))
    })
    .catch((error) => {
      dispatch(actionFailed(error.message));
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
          dispatch(actionFailed(error.message));
        });
    }
  } catch (error: any) {
    dispatch(actionFailed(error.message));
  }
};


const deleteFile = (fileName: string): AppThunk =>
  async () => {
    const storage = getStorage();
    // Create a reference to the file to delete
    const desertRef = ref(storage, `Avatars/${fileName}`);
    deleteObject(desertRef).then(() => {
    })
  };


export const updatePhotoProfile = (photoURL: string, photoName: string, currentEmail: string): AppThunk => async dispatch => {
  try {
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
          GetUserAccountInfo().then((user: UserInterface | undefined) => {
            dispatch(setUser(user as UserInterface));
            dispatch(actionSuccess("Profile Photo updated successfully!"));
          });
        })
      }).catch((error) => {
        dispatch(actionFailed(error.message));
      });
    }
  } catch (error: any) {
    dispatch(actionFailed(error.message));
  }
};

// Function to employee document (The trigger function will delete other info in the database (firebase cloud functions))
export const deleteAccountAndDocument = (): AppThunk => async dispatch => {
  try {
    const user = auth.currentUser;
    if (user !== null) {
      dispatch(setLoading(true));
      // Get the employee document reference
      const docRef = doc(db, "employees", user.email as string);
      // Delete the employee document
      deleteDoc(docRef).then(async () => {
        // Delete the profile image from storage
        const userInfo = store.getState().auth.user as UserInterface;
        dispatch(deleteFile(userInfo.avatar.photoName));
      }).catch((error) => {
        dispatch(actionFailed(error.message));
      });
    }
  } catch (error: any) {
    dispatch(actionFailed(error.message));
  }
};


