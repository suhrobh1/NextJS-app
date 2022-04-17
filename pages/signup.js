import React, { useState } from "react";
import { useRouter } from "next/router";
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
import { RiWindyFill } from "react-icons/ri";
import { RiGithubFill } from "react-icons/ri";
import { RiGoogleFill } from "react-icons/ri";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  GithubAuthProvider,
} from "firebase/auth";
import { auth, db, signup } from "../utils/firebase";
//import * as functons from 'firebase-functions';

const SignUpPage = () => {

const router = useRouter();
const [userSignUpData, setUserSignUpData] = useState({});
const [error, setError] = useState("");


  const CreateAccount = (user) => {
    const auth = getAuth();
    console.log(auth);
    console.log(user);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const refUser = doc(db, "users", uid);
        setDoc(
          refUser,
          {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
            //githubId: user.reloadUserInfo.screenName,
            openToWork: true,
            portfolioUrl: "",
            bio: "",
            location: "",

            _createdAt: serverTimestamp(),
            _updatedAt: serverTimestamp(),
          },
          { merge: true }
        )
          .then(function () {
            console.log("everything worked");
            router.push("/profile");
          })
          .then(function () {
            console.log(user.displayName + " created");
          })
          .catch(function (error) {
            console.log("error: " + error);
          });
      } else {
        // User is signed out
        // ...
        console.log("User is signed out");
      }
    });
  };

  const signUpWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Print result:___", result);
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        console.log("Print credential:___", credential);
        const token = credential.accessToken;
        console.log("Print token:___", token);
        // The signed-in user info.
        const user = result.user;
        console.log("User", user);
        const auth = getAuth();
        CreateAccount(user);
      })
      .catch((error) => {
        
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Print result:___", result);
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log("Print credential:___", credential);
        const token = credential.accessToken;
        console.log("Print token:___", token);
        // The signed-in user info.
        const user = result.user;
        console.log("User", user);
        const auth = getAuth();
        CreateAccount(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("Error from GoogleAuth Exception")
        // ...
      });
  };



  const submitHandler = (e) => {
    e.preventDefault();
    console.log("email and password", userSignUpData.email, userSignUpData.password);
    signup(userSignUpData.email, userSignUpData.password)
    .then((data) => {
      console.log("data from signup", data.user.uid);
      const refUser = doc(db, "users", data.user.uid);
     // setDoc(refUser, { ...userSignUpData, uid: data.user.uid });
      console.log("User from state", userSignUpData);
      router.push("/new-user");
    })
    .catch((err) =>{
      const error = JSON.parse(JSON.stringify(err));
       console.log("Error form .catch:", error.code)
       console.log("Error form .catch:", err)
      setError(error.code)
    });

    // const uid = auth.currentUser.uid;
  };

  const handleChange = (e) => {
    setUserSignUpData({
      ...userSignUpData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <div className="mt-12 py-6 border  border border-gray-400 rounded-xl lg:w-1/4 md:w-1/2 sm:w-full mx-auto ">
      <h3 className="text-xl lg:text-center font-bold text-gray-500  sm: text-center m-6">
            Sign up for free
          </h3>
      <div className="w-full inline-block ">
        <div
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full border border-indigo-500 font-bold text-indigo-500 bg-white hover:bg-indigo-500 hover:text-white"
          onClick={signUpWithGithub}
        >
          <span className="mr-2 self-center">
            <RiGithubFill className="h-8 w-8" />
          </span>
          Sign up with Github
        </div>
      </div>
      <div className="w-full inline-block mt-2">
        <div
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full border border-indigo-500 font-bold text-indigo-500 bg-white hover:bg-indigo-500 hover:text-white"
          onClick={signUpWithGoogle}
        >
          <span className="mr-2 self-center">
            <RiGoogleFill className="h-8 w-8" />
          </span>
          Sign Up with Google
        </div>
      </div>
      <form
        className="space-y-8 divide-y divide-gray-200 w-3/4 mx-auto"
        onSubmit={submitHandler}
      >
        <div className="  ">
          <h3 className="text-xl font-bold text-gray-500 sm: text-center lg:text-center m-6">
            OR
          </h3>
          {
            error? (error==="auth/email-already-in-use") ? <span className="text-sm font-italic text-red-500 sm:text-center m-6">This email is already in use! </span>: null
            :null




          }
          
             
         

          <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 m-4">
            <label
              htmlFor="email"
              className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-1 ">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                value={userSignUpData.email}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 m-4">
            <label
              htmlFor="username"
              className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="password"
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                value={userSignUpData.password}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 m-4">
            <label
              htmlFor="username"
              className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="confirmPassword"
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                value={userSignUpData.confirmPassword}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
