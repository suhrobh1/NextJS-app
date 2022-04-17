import React from "react";
import VehicesComponent from "../../components/VehicesComponent";
import VehicleComponent from "../../components/VehicleComponent";
import SideNavigation from "../../components/SideNavigation";
const vehiclesPage = (props) => {

  const sideNavStatus = true;
  const id = 1;

  return (
    <div className="border flex">
      {/* <VehicleComponent /> */}
      <SideNavigation sideNavStatus = {sideNavStatus} id = {id}  />
      <VehicesComponent/>
    </div>
  );
};

export default vehiclesPage;
