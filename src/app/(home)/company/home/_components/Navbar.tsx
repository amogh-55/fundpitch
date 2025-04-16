"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Search,
  Bell,
  User,
  Menu,
  X,
  Home,
  Users,
  Building,
  FileText,
  Clock,
  Box,
  BarChart,
  HandCoins,
  Star,
  UserCog,
  LogOut,
} from "lucide-react";
import LogoutButton from "@/app/(home)/_components/LogoutButton";
import NotificationContent from "./notification-content";
import { api } from "@/trpc/react";

const navItems = [
  {
    name: "Home",
    icon: <Home className="mr-1 h-5 w-5" />,
  },
  {
    name: "Teams",
    icon: <Users className="mr-1 h-5 w-5" />,
  },
  {
    name: "Business Verticals",
    icon: <Star className="mr-1 h-5 w-5" />,
  },
  // {
  //   name: "Subsidiaries",
  //   icon: <Building className="mr-1 h-5 w-5" />,
  // },
  {
    name: "Documents",
    icon: <FileText className="mr-1 h-5 w-5" />,
  },
  // {
  //   name: "Timeline",
  //   icon: <Clock className="mr-1 h-5 w-5" />,
  // },
  {
    name: "Invite Journey",
    icon: <Users className="mr-1 h-5 w-5" />,
  },
  {
    name: "Product",
    icon: <Box className="mr-1 h-5 w-5" />,
  },
  // {
  //   name: "Analytics",
  //   icon: <BarChart className="mr-1 h-5 w-5" />,
  // },
  {
    name: "Expressions",
    icon: <HandCoins className="mr-1 h-5 w-5" />,
  },
];

interface NavbarProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

const Navbar = ({ onTabChange, activeTab }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const { data, isLoading } =
    api.companyNotification.getInviteHistoryCount.useQuery();

  const handleNavClick = (name: string) => {
    onTabChange(name);
  };

  return (
    <header className="relative flex w-full items-center justify-between rounded-xl bg-transparent p-2 px-2 sm:px-4">
      {/* Logo */}
      <h1 className="whitespace-nowrap text-lg font-bold text-gray-800 sm:text-xl">
        Fund<span className="text-[#2595BE]">Pitch</span>
      </h1>

      {/* Desktop Navigation (xl and above) */}
      <nav className="mx-4 hidden flex-1 items-center justify-center xl:flex">
        <div className="flex items-center space-x-3 px-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`flex items-center whitespace-nowrap rounded-2xl px-3 py-1.5 text-xs transition-all ${
                activeTab === item.name
                  ? "bg-[#40C3F3] text-white"
                  : "bg-white hover:bg-[#40C3F3] hover:text-white"
              }`}
              onClick={() => handleNavClick(item.name)}
            >
              {React.cloneElement(item.icon, {
                className: "h-4 w-4 mr-2",
              })}
              {item.name}
            </Button>
          ))}
        </div>
      </nav>

      {/* Right Section */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div>
          <Sheet>
            <SheetTrigger className="relative rounded-xl bg-white p-1.5 transition hover:bg-[#40C3F3] hover:text-white">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {!isLoading && data !== undefined && data > 0 && (
                <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-5 sm:w-5">
                  {data > 99 ? "99+" : data}
                </div>
              )}
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[400px] md:w-[500px]">
              <SheetHeader>
                <NotificationContent />
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <Popover>
          <PopoverTrigger className="mb-0">
            <div className="mb-0 cursor-pointer rounded-xl bg-white p-1.5 transition hover:bg-[#40C3F3] hover:text-white">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-40 sm:w-48">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="flex items-center justify-start text-xs sm:text-sm"
                onClick={() =>
                  router.push("/company/account-setup/basic-details")
                }
              >
                <UserCog className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Edit Profile
              </Button>
              <LogoutButton />
            </div>
          </PopoverContent>
        </Popover>

        {/* Mobile & Tablet Menu Button */}
        <button
          className="flex items-center gap-1.5 rounded-xl bg-white px-2 py-1.5 sm:gap-2 sm:px-3 xl:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-xs font-medium sm:text-sm">{activeTab}</span>
          {isOpen ? (
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </div>

      {/* Mobile & Tablet Navigation Menu */}
      {isOpen && (
        <nav className="absolute right-0 top-12 z-50 flex w-1/2 justify-center rounded-xl bg-white p-2 shadow-md sm:top-14 sm:p-3 xl:hidden">
          <div className="max-w- flex w-full flex-col items-center space-y-1 sm:space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`flex w-full items-center justify-start rounded-xl px-4 py-2 text-xs transition-all sm:px-6 sm:text-sm ${
                  activeTab === item.name
                    ? "bg-[#40C3F3] text-white"
                    : "bg-white hover:bg-[#40C3F3] hover:text-white"
                }`}
                onClick={() => {
                  handleNavClick(item.name);
                  setIsOpen(false);
                }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex-shrink-0">
                    {React.cloneElement(item.icon, {
                      className: "h-4 w-4 sm:h-5 sm:w-5",
                    })}
                  </div>
                  <span className="truncate">{item.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
