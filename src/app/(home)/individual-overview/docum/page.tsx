"use client";
import React, { Suspense } from "react";
import UserDetailsCard from "../_components/UserDetailsCard";
import RightBar from "../_components/Rightbar";

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-row">
        <div className="flex w-full flex-col">
          <div className="px-4">
            <UserDetailsCard setBio={false} setDoc={true} />
          </div>
        </div>

        {/* <div className="w-1/4">
      <RightBar />
    </div> */}
      </div>
    </Suspense>
  );
};

export default Dashboard;
