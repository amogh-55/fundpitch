"use client";
import React from "react";
import UserDetailsCard from "../_components/UserDetailsCard";

const Dashboard = () => {
  return (
    <div className="flex flex-row">
      <div className="flex w-full flex-col">
        <div className="px-4">
          <UserDetailsCard setBio={false} setDoc={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
