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

  
    
  const [userData, setUserData] = useState({
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
  });

  
  
  
  return (
    <div>
      <div className="w-full inline-block ">
      </div>
      <NewUserForm
        userData={userData}
        setUserData={setUserData}
      />
    </div>
  );
};

export default NewUserPage;
