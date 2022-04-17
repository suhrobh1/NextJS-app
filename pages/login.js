import React, {useState} from "react";
import { RiWindyFill } from "react-icons/ri";
import { RiGithubFill } from "react-icons/ri";
import { RiGoogleFill } from "react-icons/ri";
import { useRouter } from "next/router";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  GithubAuthProvider,
} from "firebase/auth";
import { auth, useAuth, login } from "../utils/firebase";


const LoginPage = (props) => {

  const currentUser = useAuth();
  const router = useRouter();
  const { loggedIn, setLoggedIn } = props;

  const [userSignInData, setUserSignInData] = useState({});


  const handleChange = (e) => {
    setUserSignInData({
      ...userSignInData,
      [e.target.name]: e.target.value,
    });
  };

async function loginHandler(e) {
  e.preventDefault();
  try {
    console.log("signindata", userSignInData.email, userSignInData.password)
    await login(userSignInData.email, userSignInData.password)
    .then((data) => {console.log("data from login", data)})
    .catch((err) => {console.log("error from sign up catch", err)})
    router.push("/profile")
  } catch {
    console.log("error at login")
  }

}
  


  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        router.push("/profile");

        console.log(user);
        setLoggedIn(true);
        // ...
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

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
        router.push("/profile");
        setLoggedIn(true);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(
          error +
            " " +
            errorCode +
            " " +
            errorMessage +
            " " +
            email +
            " " +
            credential
        );
        // ...
        router.push("/problem");
      });
  };

  const signInHandler = () => {

  }

  return (
<div className="mt-12 py-6 border  border border-gray-400 rounded-xl lg:w-1/4 md:w-1/2 sm:w-full mx-auto ">
      <h3 className="text-xl font-bold text-gray-500 sm:text-center lg:text-center m-6">
            Sign in
          </h3>
      <div className="w-full inline-block ">
        <div
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full border border-indigo-500 font-bold text-indigo-500 bg-white hover:bg-indigo-500 hover:text-white"
          onClick={signInWithGithub}
        >
          <span className="mr-2 self-center">
            <RiGithubFill className="h-8 w-8" />
          </span>
          Sign in with Github
        </div>
      </div>
      <div className="w-full inline-block mt-2">
        <div
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full border border-indigo-500 font-bold text-indigo-500 bg-white hover:bg-indigo-500 hover:text-white"
          onClick={signInWithGoogle}
        >
          <span className="mr-2 self-center">
            <RiGoogleFill className="h-8 w-8" />
          </span>
          Sign in with Google
        </div>
      </div>
      <form
        className="space-y-8 divide-y divide-gray-200 w-3/4 mx-auto"
        onSubmit={signInHandler}
      >
        <div className="  ">
          <h3 className="text-xl font-bold text-gray-500 sm:text-center m-6">
            OR
          </h3>

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
                value={userSignInData.email}
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
                value={userSignInData.password}
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
              onClick={(e) => {loginHandler(e)}}
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
