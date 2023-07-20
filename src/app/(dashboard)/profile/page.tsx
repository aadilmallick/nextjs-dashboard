import SignOutButton from "@/components/SignOutButton";
import React from "react";

const Profile = () => {
  return (
    <div className="card flex-1">
      <h1 className="text-4xl font-bold">Profile</h1>
      <div className="mt-12">
        <SignOutButton />
      </div>
    </div>
  );
};

export default Profile;
