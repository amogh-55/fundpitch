import React from "react";
import UserDetailsCard from "../_components/UserDetailsCard";
import Navbar from "../_components/Navbar";
import RightBar from "../_components/Rightbar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Navbar */}
      <div className="mt-5">
        <Navbar />
      </div>

      <div className="mt-6 flex w-full flex-col">{children}</div>
    </div>
  );
};

export default Layout;
