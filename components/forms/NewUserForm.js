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
import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebase";
import { useContext } from "react";
import { UserContext } from "../../utils/context";
import { app } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import avatar from './../assets/avatar.jpg';



export const NewUserForm = (props) => {
  const router = useRouter();
  const { user, username } = useContext(UserContext);
  const { userData, setUserData } = props;
  const [pushNotification, setPushNotification] = useState({
    byEmail: false,
    byText: false,
  });
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (user) {
      const uid = auth.currentUser.uid;
      console.log(uid);
      const docRef = doc(db, "users", uid);
      const docSnap = getDoc(docRef).then((doc) => {
        docSnap = doc.data();
        if (docSnap) {
          setUserData(docSnap);
          setPushNotification(docSnap.pushNotification);
          setUrl(docSnap.photoURL);
          console.log(docSnap);
        }
      });
    }
  }, [user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if(image){ 
    const storage = getStorage();
    let imgId = `Avatar${Math.floor(Math.random() * 1000000)}`;
    const storageRef = ref(storage, `images${imgId}`);
    uploadBytes(storageRef, image)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        const storageRef = ref(storage, `images${imgId}`);
        getDownloadURL(storageRef, image).then((url) => {
          console.log("image URL", url);
          const uid = user.uid;
          const refUser = doc(db, "users", uid);
          setDoc(
            refUser,
            {
              ...userData,
              uid: uid,
              email: user.email,
              photoURL: url,
              pushNotification: pushNotification,
              _createdAt: serverTimestamp(),
              _updatedAt: serverTimestamp(),
            },
            { merge: true }
          )
            .then(function () {
              console.log("everything worked");
              router.push("/profile");
            })
            .catch(function (error) {
              console.log("error: " + error);
            });
        });
      })
      .catch((err) => {
        const error = JSON.parse(JSON.stringify(err));
        console.log("Error form .catch:", error.code);
        console.log("Error form .catch:", err);
      });
    }else{
      const uid = user.uid;
      const refUser = doc(db, "users", uid);
      setDoc(
        refUser,
        {
          ...userData,
          uid: uid,
          email: user.email,
          photoURL: url,
          pushNotification: pushNotification,
        },
        { merge: true }
      )
        .then(function () {
          console.log("everything worked");
          router.push("/profile");
        })
        .catch(function (error) {
          console.log("error: " + error);
        });

    }
  };

  const [image, setImage] = useState(null);
  const changeHandler = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const pushNotificationHandler = (value) => {
    console.log(" value", value);
    setPushNotification(() => {
      return {
        ...pushNotification,
        [value]: !pushNotification[value],
      };
    });
  };

  return (
    <form
      className="space-y-8 divide-y divide-gray-200 lg:w-1/2 lg:mx-auto sm: mx-5 border  border border-gray-400 rounded-xl p-6"
      onSubmit={submitHandler}
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value={userData.username}
                  placeholder={userData.username}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  value={userData.about}
                  placeholder={userData.about}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Write a few sentences about yourself.
              </p>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Photo
              </label>
              <div className="mt-1 flex items-center">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    className="rounded-full h-20 w-20"
                  />
                ) : (
                  <img src={avatar} className="rounded-full h-20 w-20" />
                )}

                <input
                  type="file"
                  name="imageUrl"
                  onChange={changeHandler}
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-6"></div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Use a permanent address where you can receive mail.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={userData.firstName}
                  placeholder={userData.firstName}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  autoComplete="family-name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={userData.lastName}
                  placeholder={userData.lastName}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <div className="mt-1">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={userData.country}
                  placeholder={userData.country}
                  onChange={(e) => handleChange(e)}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Street address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="address"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={userData.address}
                  placeholder={userData.address}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={userData.city}
                  placeholder={userData.city}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State / Province
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="state"
                  id="state"
                  autoComplete="address-level1"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={userData.state}
                  placeholder={userData.state}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="zip"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP / Postal code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="zip"
                  id="zip"
                  autoComplete="postal-code"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={userData.zip}
                  placeholder={userData.zip}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We'll always let you know about important changes, but you pick
              what else you want to hear about.
            </p>
          </div>
          <div className="mt-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">
                By Email
              </legend>
              <div className="mt-4 space-y-4">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-700"
                    >
                      Comments
                    </label>
                    <p className="text-gray-500">
                      Get notified when someones posts a comment on a posting.
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-700"
                    >
                      Offers
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-base font-medium text-gray-900">
                Push Notifications
              </legend>

              <div className="mt-4 space-y-4">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={pushNotification.byText}
                      onChange={(e) => pushNotificationHandler(e.target.value)}
                      value="byText"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-700"
                    >
                      Text Message
                    </label>
                    <p className="text-gray-500">
                      Get notified when someones posts a comment on a posting.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={pushNotification.byEmail}
                      onChange={(e) => pushNotificationHandler(e.target.value)}
                      value="byEmail"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
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
  );
};
