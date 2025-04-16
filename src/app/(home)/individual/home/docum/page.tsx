"use client";
import React from "react";
import UserDetailsCard from "../../_components/UserDetailsCard";
import RightBar from "../../_components/Rightbar";

const Dashboard = () => {
  return (
    <div className="flex w-full flex-col px-2 sm:px-3 md:px-4 lg:flex-row lg:gap-2 overflow-x-hidden">
      <div className="w-full flex-grow lg:w-[70%] xl:w-3/4 flex flex-col">
        <div className="w-full">
          <UserDetailsCard setBio={false} setDoc={true} />
        </div>
      </div>

      <div className="w-full mt-4 lg:mt-0 lg:w-[30%]  flex-shrink-0">
        <RightBar />
      </div>
    </div>
  );
};

export default Dashboard;
