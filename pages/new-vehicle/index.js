import React from "react";
import { NewVehicleForm } from "../../components/Forms/NewVehicleForm";
import SideNavigation from "../../components/SideNavigation";

const NewVehiclePage = () => {

  const sideNavStatus = true;
  const id = 1;
  return (
    <div className="flex">
      <SideNavigation sideNavStatus = {sideNavStatus} id = {id} />
      <NewVehicleForm />
    </div>
  );
};
export default NewVehiclePage;
