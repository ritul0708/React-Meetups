import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAl_zw_TjtokAkkYnxuOgwIx-4pSSiuBD4",
  authDomain: "react-meetups-fbcd0.firebaseapp.com",
  databaseURL: "https://react-meetups-fbcd0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-meetups-fbcd0",
  storageBucket: "react-meetups-fbcd0.appspot.com",
  messagingSenderId: "515241132437",
  appId: "1:515241132437:web:f19d13abdf0f8bfd9cf69c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };