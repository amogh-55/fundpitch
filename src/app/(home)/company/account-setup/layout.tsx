import React from "react";
import CompanySideBar from "./_components/sidebar";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import LogoutButton from "../../_components/LogoutButton";
import CompanyTopbar from "./_components/topbar-details";
import Link from "next/link";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await api.user.getUser();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="mt-4 px-2 sm:mt-6 md:mt-8 md:px-4 lg:m-12">
      <span className="mb-2 sm:mb-4 flex flex-row items-center justify-between text-center">
        <Link href="/company/home" className="flex flex-row text-lg sm:text-xl font-bold">
          Fund<p className="text-[#2595BE]">Pitch</p>
        </Link>

        <LogoutButton />
      </span>

      <div className="flex h-full w-full flex-grow flex-col rounded-xl shadow-md">
        <CompanyTopbar users={user} />
        <div className="flex h-full w-full flex-grow flex-col md:flex-row">
          <CompanySideBar />
          <div className="bg-white-1 w-full overflow-x-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
