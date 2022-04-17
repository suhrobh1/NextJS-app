// Import the functions you need from the SDKs you need
import {getFirestore} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import { getApp as _getApp, getApps, initializeApp } from "firebase/app";
import 'firebase/firestore';
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { useEffect, useState } from "react";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsymqJkD5qkouxeUA5-XFUyS6Xoo_J8X4",
  authDomain: "vehiclerental-813b8.firebaseapp.com",
  projectId: "vehiclerental-813b8",
  storageBucket: "vehiclerental-813b8.appspot.com",
  messagingSenderId: "700973178719",
  appId: "1:700973178719:web:db2d27fa2cd1c36a70e0ea"
};


export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
  
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps();
const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();

const storage = getStorage(initializeApp(firebaseConfig));

export { db, auth, provider, storage};

export function signup(email, password){
    return createUserWithEmailAndPassword(auth, email, password);
}



/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
 export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}

//Custom Hook
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
  const unsub =   onAuthStateChanged(auth, user => setCurrentUser(user))
  return unsub;
  }, [])

  return currentUser;
}