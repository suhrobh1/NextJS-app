import React from "react";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../utils/context";
import {Link} from '@reach/router';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "@firebase/firestore";
import { db, auth } from "../utils/firebase";
import { useRouter } from "next/router";

const VehicesComponent = (props) => {
  const { user, username } = useContext(UserContext);
  const router = useRouter();
  const [userId, setUserId] = useState({});
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    //getting data
    if (user) {
      try {
        const uid = auth.currentUser.uid;
        setUserId(uid);
        const collectionRef = collection(db, "users", uid, "vehicles");
        const q = query(collectionRef, orderBy("year", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const vehicles = [];
          querySnapshot.forEach((doc) => {
            console.log("doc id?", doc.id);
            vehicles.push({ id: doc.id, ...doc.data() });
          });
          setVehicles(vehicles);
          console.log("Vehicles", vehicles);
        }).catch((err) => {
          console.log("error from firebase snapshot", err);
        });
      } catch {
        console.log("error");
      }
    }
  }, [user]);

  const addHandler = () => {
    router.push("/new-vehicle");
  };

  const files = [
    {
      title: "IMG_4985.HEIC",
      size: "3.9 MB",
      source:
        "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
    },
    // More files...
  ];

  const [deletePopup, setDeletePopUp] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState();

  const deleteHandler = (idFromBelow) => {
    setDeleteVehicleId(idFromBelow);
    setDeletePopUp(true);
  };

  const popUpCancelHandler = () => {
    setDeletePopUp(false);
    router.push("/vehicles");
  };

  async function popUpConfirmHandler() {
    await deleteDoc(doc(db, "users", userId, "vehicles", deleteVehicleId));
    setVehicles(
      vehicles.filter((vehicle, index) => vehicle.id !== deleteVehicleId)
    );
    setDeletePopUp(false);
    router.push("/vehicles");
  }

   
  return (
    <div>
      {deletePopup ? (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex ">
          <div className="relative lg: p-8  bg-white sm: w-1/2 lg: w-full max-w-sm m-auto flex-col flex border border-red-500 rounded-lg items-center  shadow-2xl shadow-red-400/80">
            <p>Are you sure? </p>
            <div className="flex mt-6 ">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 sm: mr-8  lg:mr-20 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                onClick={popUpConfirmHandler}
              >
                <span>Delete</span>
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                onClick={popUpCancelHandler}
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mt-4 flex space-x-3 justify-end m-6 ">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          onClick={addHandler}
        >
          <span>Add Vehicle</span>
        </button>
      </div>
      <div className="flex">
        <div
          role="list"
          className="  grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-4"
        >
          {vehicles.map((vehicle, index) => (
            <div key={index} className="relative">
              <div className="group block aspect-w-20 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden hover:shadow-lg hover:shadow-gray-400/80">
                <a href="#" onClick={()=> router.push(`/vehicles/${vehicle.id}`)}>
                  <img 
                    src={vehicle.photoURL}
                    alt="vehicle image"
                    className="object-cover pointer-events-none group-hover:opacity-75"
                  />
                </a>
              </div>
              <div className="flex justify-between mt-2 align-top px-1">
                <div>
                  <p className=" block text-sm font-medium text-gray-900 truncate pointer-events-none">
                    {vehicle.make}
                  </p>
                  <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                    {vehicle.model}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className=" mt-1 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    onClick={() => deleteHandler(vehicle.id)}
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicesComponent;
