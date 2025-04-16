"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
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
  ArrowLeft,
} from "lucide-react";

import { usePathname } from "next/navigation";
import LogoutButton from "../../_components/LogoutButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isInviteTrue, setIsInviteTrue] = useState(false);
  const [pop, setPop] = useState(false);

  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      path: `/individual-overview?id=${id}`,
      icon: <Home className="mr-1 h-5 w-5" />,
    },
    {
      name: "Documents",
      path: `/individual-overview/docum?id=${id}`,
      icon: <Folder className="mr-1 h-5 w-5" />,
    },
  ];

  return (
    <>
      <header className="relative flex items-center justify-center gap-12 rounded-xl bg-transparent p-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push(`/company/home`)}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Back to Home</span>
          </Button>
        </div>
        <div className="flex flex-row items-center justify-center gap-20">
          <span className="flex flex-row">
            {navItems.map((item) => (
              <Link href={item.path} key={item.name} passHref>
                <Button
                  variant="ghost"
                  className={`flex items-center text-xs ${
                    pathname === item.path.split("?")[0]
                      ? "bg-[#40C3F3] text-white"
                      : "bg-white"
                  } ml-[-5px] mr-4 rounded-full px-3 py-2 transition-all hover:bg-[#40C3F3] hover:text-white`}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </span>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="absolute left-0 top-16 flex w-full flex-col items-center space-y-3 rounded-xl bg-white p-4 shadow-md md:hidden">
            {navItems.map((item) => (
              <Link href={item.path} key={item.name} passHref>
                <Button
                  variant="ghost"
                  className="flex w-full items-center rounded-xl bg-white px-4 py-2 text-center transition-all hover:bg-[#40C3F3] hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
