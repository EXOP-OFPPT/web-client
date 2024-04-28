import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBXBh7BHxCbhNRE_qd1OnL65mHZicR2ZA",
  authDomain: "exop-d02fc.firebaseapp.com",
  projectId: "exop-d02fc",
  storageBucket: "exop-d02fc.appspot.com",
  messagingSenderId: "253073675184",
  appId: "1:253073675184:web:273310574e3b5bc0e07c75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


