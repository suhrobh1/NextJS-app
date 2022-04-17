import React from "react";
import ProfileComponent from "../components/ProfileComponent";
import SideNavigation from "../components/SideNavigation";
const profilePage = (props) => {

  const sideNavStatus = true;
  const id = 0;
  return (
    <div className="border flex">
      <SideNavigation sideNavStatus = {sideNavStatus} id = {id} />
      <ProfileComponent />
    </div>
  );
};

export default profilePage;
