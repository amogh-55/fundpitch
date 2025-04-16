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
  BellDot,
  Settings,
  Folder,
  UserCircle2,
  Globe,
  UserCog,
} from "lucide-react";
import InviteModal from "./invite-modal";
import { usePathname } from "next/navigation";
import LogoutButton from "../../_components/LogoutButton";

const navItems = [
  {
    name: "Home",
    path: "/individual/home",
    icon: <Home className="mr-1 h-5 w-5" />,
  },
  {
    name: "Documents",
    path: "/individual/home/docum",
    icon: <Folder className="mr-1 h-5 w-5" />,
  },
];
const navitems2 = [
  {
    name: "My network",
    path: "/individual/network",
    icon: <Globe className="mr-1 h-5 w-5" />,
  },
  {
    name: "Invite Individuals",
    mobileTitle: "Invite Individuals",
    path: "",
    icon: <UserCircle2 className="mr-1 h-5 w-5" />,
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isInviteTrue, setIsInviteTrue] = useState(false);
  const [pop, setPop] = useState(false);

  const pathname = usePathname();

  return (
    <>
      {isInviteTrue && (
        <div className="z-10 overflow-hidden">
          <InviteModal
            show={isInviteTrue}
            onClose={() => setIsInviteTrue(false)}
          />
        </div>
      )}
      <header className="relative flex flex-wrap items-center justify-between rounded-xl bg-transparent p-2">
        <div className="flex w-full items-center justify-between sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <h1 className="ml-2 text-xl font-bold md:text-2xl">
              Fund<span className="text-[#2595BE]">Pitch</span>
            </h1>

            {/* Desktop Primary Nav */}
            <div className="hidden items-center sm:flex">
              {navItems.map((item) => (
                <Link href={item.path} key={item.name} passHref>
                  <Button
                    variant="ghost"
                    className={`flex items-center text-xs ${pathname === item.path ? "bg-primaryBlue" : "bg-white"} ml-1 rounded-full px-2 py-1.5 transition-all hover:bg-[#40C3F3] hover:text-white sm:ml-2 sm:px-2.5 md:px-3`}
                  >
                    {item.icon}
                    <span className="ml-1">{item.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-1 hover:bg-gray-100 sm:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Secondary Nav */}
        <nav className="hidden items-center sm:flex">
          <div className="flex items-center gap-1 pr-2 sm:gap-2 md:gap-3">
            {navitems2.map((item) => (
              <Link href={item.path} key={item.name} passHref>
                <Button
                  variant="ghost"
                  onClick={
                    item.name === "Invite Individuals"
                      ? () => setIsInviteTrue(true)
                      : undefined
                  }
                  className={`flex items-center text-xs ${pathname === item.path ? "bg-primaryBlue" : "bg-white"} rounded-full px-2 py-1.5 transition-all hover:bg-[#40C3F3] hover:text-white sm:px-2.5 md:px-3`}
                >
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </Button>
              </Link>
            ))}

            <Popover>
              <PopoverTrigger>
                <div className="ml-1 cursor-pointer rounded-xl bg-white p-1.5 transition hover:bg-[#40C3F3] hover:text-white">
                  <User className="h-5 w-5" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start"
                    onClick={() => router.push("/individual/account-setup")}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <LogoutButton />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-14 z-50 flex w-full flex-col rounded-b-lg bg-white shadow-lg sm:hidden">
            <div className="flex flex-col p-2">
              <h3 className="mb-1 px-3 py-2 text-sm font-medium text-gray-500">
                Navigation
              </h3>
              {navItems.map((item) => (
                <Link href={item.path} key={item.name} passHref>
                  <Button
                    variant="ghost"
                    className={`mb-1 flex w-full items-center justify-start rounded-lg py-2 text-sm ${
                      pathname === item.path
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center">
                      {React.cloneElement(item.icon, {
                        className: "mr-3 h-5 w-5",
                      })}
                      {item.name}
                    </span>
                  </Button>
                </Link>
              ))}

              <h3 className="mb-1 mt-2 px-3 py-2 text-sm font-medium text-gray-500">
                Actions
              </h3>
              {navitems2.map((item) => (
                <Link
                  href={item.path}
                  key={item.mobileTitle ?? item.name}
                  passHref
                  onClick={(e) => {
                    if (item.name === "Invite Individuals") {
                      e.preventDefault();
                      setIsInviteTrue(true);
                      setIsOpen(false);
                    }
                  }}
                >
                  <Button
                    variant="ghost"
                    className={`mb-1 flex w-full items-center justify-start rounded-lg py-2 text-sm ${
                      pathname === item.path
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center">
                      {React.cloneElement(item.icon, {
                        className: "mr-3 h-5 w-5",
                      })}
                      {item.mobileTitle ?? item.name}
                    </span>
                  </Button>
                </Link>
              ))}

              <Button
                variant="ghost"
                className="mb-1 flex w-full items-center justify-start rounded-lg py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  router.push("/individual/account-setup");
                  setIsOpen(false);
                }}
              >
                <span className="flex items-center">
                  <UserCog className="mr-3 h-5 w-5" />
                  Edit Profile
                </span>
              </Button>

              <div className="mt-2 px-2">
                <LogoutButton />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
