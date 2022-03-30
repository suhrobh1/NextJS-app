import React, { useState } from "react";

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
import { auth, db } from "../utils/firebase";

const SignUpPage = () => {
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
        // ...
      });
  };

  const [userSignUpData, setUserSignUpData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("email and password", user.email, user.password);
    signup(user.email, user.password).then((data) => {
      console.log("data from signup", data.user.uid);
      const refUser = doc(db, "users", data.user.uid);
      setDoc(refUser, { ...user, uid: data.user.uid });
      console.log("User from state", user);
    });

    // const uid = auth.currentUser.uid;
  };

  const handleChange = (e) => {
    setUserSignUpData({
      ...userSignUpData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mt-6">
      <div className="w-full inline-block ">
        <div
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full font-bold text-white bg-black/50 hover:bg-black shadow-lg shadow-green-400/50 hover:shadow-green-400/90"
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
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full font-bold text-white bg-black/50 hover:bg-black shadow-lg shadow-green-400/50 hover:shadow-green-400/90"
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
        <div className="space-y-8 divide-y divide-gray-200 mx-auto border">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">OR</h3>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 ">
            
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:w-1/2 sm:text-sm border-gray-300 rounded-md"
                  value={userSignUpData.email}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="password"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-1/3 sm:text-sm border-gray-300 rounded-md"
                  value={userSignUpData.password}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-4 ">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  autoComplete="confirmPassword"
                  className="shadow-sm focus:ring-indigo-900 focus:border-indigo-500 block w-1/3 sm:text-sm border-gray-300 rounded-md"
                  value={userSignUpData.confirmPassword}
                  onChange={(e) => handleChange(e)}
                />
              </div>
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
