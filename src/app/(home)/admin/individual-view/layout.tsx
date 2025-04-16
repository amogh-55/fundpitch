import React, { Suspense } from "react";
import UserDetailsCard from "./_components/UserDetailsCard";
import Navbar from "./_components/Navbar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mt-5">
          <Navbar />
        </div>
      </Suspense>

      <div className="mt-6 flex w-full flex-col">{children}</div>
    </div>
  );
};

export default Layout;
