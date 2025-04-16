import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/trpc/server";
import { Home, ClipboardList, Users, Building2, User, HomeIcon, Menu, BellDot } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "../_components/LogoutButton";
import Navbar from "./_components/Navbar";
import AdminSidebar from "./_components/sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await api.user.getUser();
  
  if (!user) {
    return redirect("/admin/login");
  }
  
  if (user.userType !== "admin") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-3xl text-white">
        Unauthorized
      </div>
    );
  }
  
  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-gray-100 overflow-hidden">
      {/* Sidebar - hidden on mobile, visible on md and up */}
      <div className="hidden md:flex md:w-64 lg:w-72 xl:w-80 flex-shrink-0 flex-col bg-white p-3 sm:p-4 shadow-md">
        <h1 className="mb-4 md:mb-6 text-lg md:text-xl font-bold text-black px-2">
          Fund<span className="text-[#2595BE]">Pitch</span>
        </h1>
        <nav className="space-y-2 md:space-y-4">
          <AdminSidebar />
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full overflow-hidden">
        {/* Top Navigation */}
        <nav className="relative z-20 flex w-full items-center justify-between bg-white p-3 sm:p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <div className="flex flex-row items-center gap-1 md:gap-2 cursor-pointer rounded-full bg-[#40C3F3] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2">
              <HomeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white"/>
              <span className="text-xs sm:text-sm font-bold text-white">Home</span>
            </div>
            
            <div className="flex items-center hover:bg-[#40C3F3] p-1.5 hover:text-white rounded-xl">
              {/* <img 
                src="/assets/images/bell.png" 
                title="Notifications" 
                alt="Notifications" 
                className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6"
              /> */}
              <BellDot className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
            </div>
            
            <Popover>
              <PopoverTrigger className="mb-0">
                <div className="mb-0 cursor-pointer rounded-xl bg-white p-1.5 transition hover:bg-[#40C3F3] hover:text-white">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col space-y-2">
                  <LogoutButton />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </nav>
        
        {/* Page Content */}
        <div className="relative flex-1 overflow-y-auto bg-gray-100 pb-16 md:pb-0">
          <div className="p-3 sm:p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>

      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex items-center justify-around px-2 py-2 sm:py-3">
          <AdminSidebar />
        </div>
      </div>
    </div>
  );
};

export default Layout;