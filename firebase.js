// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-d1aIRaHdYUDteaodi5EsLtj6yOddPyg",
  authDomain: "ai-customer-support-fbd9b.firebaseapp.com",
  projectId: "ai-customer-support-fbd9b",
  storageBucket: "ai-customer-support-fbd9b.appspot.com",
  messagingSenderId: "295893617137",
  appId: "1:295893617137:web:f1e266677c554507195c50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

