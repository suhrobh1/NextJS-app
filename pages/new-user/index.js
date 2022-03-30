import { NewUserForm } from "../../components/Forms/NewUserForm";
import {db} from "../../utils/firebase";
import React, { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  docRef,
  collection,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useContext } from "react";
import { UserContext } from "../../utils/context";

import { app } from "firebase/app";
import { storage } from "../../utils/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import { RiWindyFill } from "react-icons/ri";
import { RiGithubFill } from "react-icons/ri";

const NewUserPage = (props) => {

  
    
  const [user, setUser] = useState({
    username: "",
    about: "",
    photoURL: "",
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    password: "",
    confirmPassword: "",
  });

  
  
  
  return (
    <div>
      <div className="w-full inline-block ">
        <div
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full font-bold text-white bg-black/50 hover:bg-black shadow-lg shadow-green-400/50 hover:shadow-green-400/90"
          onClick={signInWithGithub}
        >
          <span className="mr-2 self-center">
            <RiGithubFill className="h-8 w-8" />
          </span>
          Sign up with Github
        </div>
      </div>
      <NewUserForm
        user={user}
        setUser={setUser}
      />
    </div>
  );
};

export default NewUserPage;
