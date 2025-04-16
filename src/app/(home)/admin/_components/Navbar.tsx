"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  const navItems = [
    {
      name: "Home",
      path: `/admin/company/home?id=${id}`,
      icon: <Home className="mr-1 h-5 w-5" />,
    },
    {
      name: "Teams",
      path: `/admin/company/team?id=${id}`,
      icon: <Users className="mr-1 h-5 w-5" />,
    },
    {
      name: "Business Verticals",
      path: `/admin/company/businessVertical?id=${id}`,
      icon: <Star className="mr-1 h-5 w-5" />,
    },
    {
      name: "Subsidiaries",
      path: `/admin/company/subsidaries?id=${id}`,
      icon: <Building className="mr-1 h-5 w-5" />,
    },
    {
      name: "Documents",
      path: `/admin/company/documents?id=${id}`,
      icon: <FileText className="mr-1 h-5 w-5" />,
    },
    {
      name: "Timeline",
      path: `/admin/company/timeline?id=${id}`,
      icon: <Clock className="mr-1 h-5 w-5" />,
    },
    {
      name: "Product",
      path: `/admin/company/product?id=${id}`,
      icon: <Box className="mr-1 h-5 w-5" />,
    },
  ];

  return (
    <header className="relative flex items-center justify-between rounded-xl bg-transparent p-2">
      <nav className="hidden space-x-4 md:flex">
        {navItems.map((item) => (
          <Link href={item.path} key={item.name} passHref>
            <Button
              variant="ghost"
              className={`flex items-center ${pathname === item.path.split("?")[0] ? "bg-[#40C3F3]" : "bg-white"} rounded-2xl px-3 py-2 text-xs transition-all hover:bg-[#40C3F3] hover:text-white`}
            >
              {item.icon}
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <div
          className="relative cursor-pointer rounded-xl bg-white p-2 transition hover:bg-[#40C3F3] hover:text-white"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-5 w-5" />
          {showNotifications && (
            <div className="absolute right-0 mt-6 h-full w-80 rounded-xl bg-white p-4 shadow-lg">
              <h3 className="mb-2 text-lg font-semibold">Notifications</h3>
              <p className="text-sm text-gray-600">No new notifications</p>
            </div>
          )}
        </div>

        <div className="cursor-pointer rounded-xl bg-white p-2 transition hover:bg-[#40C3F3] hover:text-white">
          <Search className="h-5 w-5" />
        </div>
        <div className="cursor-pointer rounded-xl bg-white p-2 transition hover:bg-[#40C3F3] hover:text-white">
          <User className="h-5 w-5" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-xl bg-white p-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="absolute left-0 top-16 flex w-full flex-col items-center space-y-3 rounded-xl bg-white p-4 shadow-md md:hidden">
          {navItems.map((item) => (
            <Link href={`item.path/id=${id}`} key={item.name} passHref>
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
  );
};

export default Navbar;
