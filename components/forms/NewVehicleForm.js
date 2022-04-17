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
import avatar from "./../assets/avatar.jpg";
import { auth, db } from "../../utils/firebase";
import { useContext } from "react";
import { UserContext } from "../../utils/context";
import { app } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { async } from "@firebase/util";

export const NewVehicleForm = (props) => {
  const router = useRouter();
  const { user, username } = useContext(UserContext);

  const [vehicleData, setVehicleData] = useState({
    make: "",
    model: "",
    year: "",
    transmission: "",
    country: "",
    city: "",
    state: "",
    zip: "",
  });
  // const [title, setTitle] = useState("");
  // const [make, setMake] = useState("");
  // const [model, setModel] = useState("");

  // useEffect(() => {
  //   //for populating the fields with existing data
  //   if (user) {
  //     const uid = auth.currentUser.uid;
  //     setUserId(uid);
  //     const docRef = doc(db, "users", uid, "vehicles", projectId);
  //     const docSnap = getDoc(docRef).then((doc) => {
  //       docSnap = doc.data();
  //       console.log("docSnap", docSnap);
  //       setTitle(docSnap.title);
  //       setOverview(docSnap.overview);
  //       setDescription(docSnap.description);
  //       setImageUrl(docSnap.imageUrl);
  //       setStack(docSnap.stack);
  //     });
  //   }
  // }, [user]);
  
const [photoURLArray, setPhotoURLArray] = useState([]);

  function UploadHanler(e) {
    e.preventDefault();
    const uid = auth.currentUser.uid;

  
    const storage = getStorage();
    const photoURLArray = [];
    console.log("photo URL array inside", photoURLArray);
    const counter = 0;
    uploadBoxContent.forEach((image) => { 
      
      let imgId = Math.floor(Math.random() * 1000);
      const storageRef = ref(storage, `${vehicleData.make}${imgId}`);
      
      uploadBytes(storageRef, image).then((snapshot) => {
        console.log("Uploaded a blob or file!");
        const storageRef = ref(storage, `${vehicleData.make}${imgId}`);
        getDownloadURL(storageRef, image).then((url) => {
        
          photoURLArray.push(url);
          console.log("image URL", url);
            if(photoURLArray.length == uploadBoxContent.length){
        console.log("yay")
      }else{
        console.log("nay")
      }
        });
      });
    setPhotoURLArray(photoURLArray);
    })
               
   
          
  }

   function CreateVehicle(e) {
     e.preventDefault();
     const uid = auth.currentUser.uid;
    const userRef = doc(db, "users", uid);
    const docSnap = getDoc(userRef).then((doc) => {
      docSnap = doc.data();
      
    });
    
    let collectionRef = collection(db, "users", uid, "vehicles");
    let docRef = doc(collectionRef);
    

    setDoc(docRef, { ...vehicleData, photoURL: photoURLArray });
    
    router.push(`/vehicles`);
    return false; // Prevent page refresh
  }

  const [uploadBoxContent, setUploadBoxContent] = useState([]);

  const [image, setImage] = useState(null);

  const changeHandler = (e) => {
    var tempUploadBoxContent = [...uploadBoxContent];
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      tempUploadBoxContent.push(e.target.files[0]);
      setUploadBoxContent(tempUploadBoxContent);
      //console.log("first box upload", uploadBoxContent);
    }
  };
  //console.log("first box upload 2", uploadBoxContent);

  const handleChange = (e) => {
    setVehicleData({
      ...vehicleData,
      [e.target.name]: e.target.value,
    });
    // console.log("vehicleData:", vehicleData);
  };

  // const addUploadBoxHandler = (e) => {
  //   e.preventDefault();
  //   // if (uploadBoxContent.length < 2)
  //   //   uploadBoxContent.push(e.target.files[0])
  //   console.log("The second box content", uploadBoxContent)
  // };

  return (
    <form
      className="space-y-8 lg:w-1/2 lg:mx-auto sm: mx-5 border  border border-gray-200 rounded-xl p-6 my-10"
      onSubmit={(e) =>CreateVehicle(e)}
    >
      <div className="space-y-8">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Add New Vehicle
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="make"
                className="block text-sm font-medium text-gray-700"
              >
                Make
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="make"
                  id="make"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block lg:w-1/3  sm: w-full sm:text-sm border-gray-300 rounded-md"
                  value={vehicleData.make}
                  placeholder={vehicleData.make}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                Model
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="model"
                  id="model"
                  autoComplete="model"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block lg:w-1/3 sm: w-full sm:text-sm border-gray-300 rounded-md"
                  value={vehicleData.model}
                  placeholder={vehicleData.model}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="year"
                  id="year"
                  autoComplete="year"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block lg:w-1/6 md: w-full sm: w-1/4 sm:text-sm border-gray-300 rounded-md"
                  value={vehicleData.year}
                  placeholder={vehicleData.year}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>

            <div className="sm:col-span-6 ">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                Transmission
              </label>
              <div className="mt-1">
                <select
                  id="transmission"
                  name="transmission"
                  autoComplete="transmission"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block lg:w-1/5 md: w-full sm: w-1/2 sm:text-sm border-gray-300 rounded-md"
                  value={vehicleData.transmission}
                  onChange={(e) => handleChange(e)}
                  placeholder={vehicleData.transmission}
                >
                  <option value="none" defaultValue hidden>
                    Select Transmission
                  </option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Image
              </label>
              <div className="mt-1 flex-row">
                <input
                  type="file"
                  name="imageUrl"
                  onChange={changeHandler}
                  className=" bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                />

                <div className="flex-row">
                  {uploadBoxContent.map((box, index) => {
                    return (
                      <div className="flex-row" key={index}>
                        <input
                          type="file"
                          name="imageUrl"
                          onChange={changeHandler}
                          className=" bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        />
                      </div>
                    );
                  })}
                  <button
                    type="submit"
                    className="mt-2 inline-flex align-middle py-1 px-3 border border-transparent shadow-sm text-sm font-xl rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={ UploadHanler}
                  >
                    Upload
                  </button>
                </div>
              </div>
              {}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
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
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block lg:w-1/3 sm: w-full sm:text-sm border-gray-300 rounded-md"
                value={vehicleData.country}
                placeholder={vehicleData.country}
                onChange={(e) => handleChange(e)}
              >
                <option value="none" defaultValue hidden>
                  Select Country
                </option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
                <option value="Russia">Russia</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-6">
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
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block lg:w-1/3 sm: w-full sm:text-sm border-gray-300 rounded-md"
                value={vehicleData.city}
                placeholder={vehicleData.city}
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
                value={vehicleData.state}
                placeholder={vehicleData.state}
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
                value={vehicleData.zip}
                placeholder={vehicleData.zip}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            onClick={() => {
              router.push("/vehicles");
            }}
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
