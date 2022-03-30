import React from "react";
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
import { auth } from "../utils/firebase";

const LoginPage = (props) => {
  const router = useRouter();
  const { loggedIn, setLoggedIn } = props;

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

  return (
    <div>
      <p>login page</p>
      <div className="w-full inline-block ">
        <div
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full font-bold text-white bg-black/50 hover:bg-black shadow-lg shadow-green-400/50 hover:shadow-green-400/90"
          onClick={signInWithGithub}
        >
          <span className="mr-2 self-center">
            <RiGithubFill className="h-8 w-8" />
          </span>
          Sign In with Github
        </div>
      </div>
      <div className="w-full inline-block mt-2">
        <div
          className="w-60 text-center items-center flex cursor-pointer flex-row justify-center align-middle mx-auto py-2 rounded-full font-bold text-white bg-black/50 hover:bg-black shadow-lg shadow-green-400/50 hover:shadow-green-400/90"
          onClick={signInWithGoogle}
        >
          <span className="mr-2 self-center">
            <RiGoogleFill className="h-8 w-8" />
          </span>
          Sign In with Google
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
