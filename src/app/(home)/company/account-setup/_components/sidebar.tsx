"use client";

import React, { useState, useEffect, Fragment } from "react";
import {
  Users,
  Menu,
  Star,
  FileText,
  Grid,
  X,
  AlignLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  children: {
    name: string;
    path: string;
  }[];
}

const CompanySideBar = (): React.ReactNode => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Company Details",
      icon: <Menu size={16} className="sm:size-18" />,
      path: "/company/account-setup/basic-details",
      children: [],
    },
    {
      name: "Team",
      icon: <Users size={16} className="sm:size-18" />,
      path: "",
      children: [
        {
          name: "Board of Directors",
          path: "/company/account-setup/team/boardofdirectors",
        },
        {
          name: "Key Management",
          path: "/company/account-setup/team/keymanagement",
        },
      ],
    },
    {
      name: "Business Verticals",
      icon: <Star size={16} className="sm:size-18" />,
      path: "/company/account-setup/business-verticals",
      children: [],
    },
    {
      name: "Documents",
      icon: <FileText size={16} className="sm:size-18" />,
      path: "",
      children: [
        {
          name: "Corporate Decks",
          path: "/company/account-setup/documents/corporate-decks",
        },
        {
          name: "Financial Documents",
          path: "/company/account-setup/documents/financial-documents",
        },
      ],
    },
    {
      name: "Products",
      icon: <Grid size={16} className="sm:size-18" />,
      path: "/company/account-setup/products",
      children: [],
    },
  ];

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  useEffect(() => {
    if (pathname === "/") {
      router.push("/company/account-setup/basic-details");
    }

    // Open accordion for active path
    menuItems.forEach((menu) => {
      if (menu.children.length > 0) {
        const hasActiveChild = menu.children.some(
          (child) => child.path === pathname,
        );
        if (hasActiveChild && !openMenus.includes(menu.name)) {
          setOpenMenus((prev) => [...prev, menu.name]);
        }
      }
    });
  }, [pathname]);

  const handleClick = (menu: MenuItem, childPath = "") => {
    const path = childPath || menu.path;
    router.push(path);

    if (menu.children.length > 0) {
      setOpenMenus((prev) =>
        prev.includes(menu.name)
          ? prev.filter((item) => item !== menu.name)
          : [...prev, menu.name],
      );
    }
  };

  // Find current active menu for mobile view
  const getCurrentMenuName = () => {
    // First check if a child path matches
    for (const menu of menuItems) {
      if (menu.children.length > 0) {
        const matchingChild = menu.children.find(
          (child) => child.path === pathname,
        );
        if (matchingChild) return menu.name;
      }
    }

    // Then check if a parent path matches
    const matchingMenu = menuItems.find((menu) => menu.path === pathname);
    return matchingMenu?.name ?? "Menu";
  };

  const isMenuActive = (menu: MenuItem) => {
    if (menu.path === pathname) return true;
    return menu.children.some((child) => child.path === pathname);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="mb-2 w-full p-2 md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex w-full items-center justify-between rounded-md bg-[#40C3F333] p-3 text-[#083A50]"
        >
          <span className="font-medium">{getCurrentMenuName()}</span>
          {isMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute z-50 mt-1 w-[calc(100%-1rem)] rounded-md bg-white p-2 shadow-lg">
            {menuItems.map((menu) => (
              <div key={menu.name} className="flex flex-col">
                <button
                  onClick={() => {
                    handleClick(menu);
                    if (menu.path) setIsMenuOpen(false);
                  }}
                  className={clsx(
                    "flex cursor-pointer items-center justify-between rounded-md p-2",
                    isMenuActive(menu)
                      ? `bg-[#40C3F333] text-[#083A50]`
                      : `text-gray-500 hover:bg-gray-100`,
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{menu.icon}</span>
                    <p className="text-xs font-medium sm:text-sm">
                      {menu.name}
                    </p>
                  </div>
                  {menu.children.length > 0 && (
                    <span
                      className={clsx(
                        "transform transition-transform",
                        openMenus.includes(menu.name) ? "rotate-180" : "",
                      )}
                    >
                      ▼
                    </span>
                  )}
                </button>

                {menu.children.length > 0 && openMenus.includes(menu.name) && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {menu.children.map((child) => (
                      <button
                        key={child.name}
                        onClick={() => {
                          handleClick(menu, child.path);
                          setIsMenuOpen(false);
                        }}
                        className={clsx(
                          "rounded-md p-2 text-left text-xs",
                          pathname === child.path
                            ? "bg-[#40C3F333] text-[#083A50]"
                            : "text-gray-500 hover:bg-gray-100",
                        )}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden h-auto w-full md:flex md:w-1/4">
        <div className="mb-10 flex flex-col gap-2 border-r-2 p-4 sm:p-6">
          {menuItems.map((menu) => (
            <div key={menu.name} className="flex flex-col pr-4">
              <button
                onClick={() => handleClick(menu)}
                className={clsx(
                  "flex cursor-pointer items-center justify-between rounded-md p-2 sm:p-3",
                  isMenuActive(menu)
                    ? `bg-[#40C3F333] text-[#083A50]`
                    : `text-gray-400 hover:bg-gray-100`,
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="pr-1 sm:pr-2">{menu.icon}</span>
                  <p className="text-xs font-semibold sm:text-sm">
                    {menu.name}
                  </p>
                </div>
                {menu.children.length > 0 && (
                  <span
                    className={clsx(
                      "transform transition-transform",
                      openMenus.includes(menu.name) ? "rotate-180" : "",
                    )}
                  >
                    ▼
                  </span>
                )}
              </button>

              {menu.children.length > 0 && openMenus.includes(menu.name) && (
                <div className="ml-6 mt-1 flex flex-col gap-1 sm:ml-8">
                  {menu.children.map((child) => (
                    <button
                      key={child.name}
                      onClick={() => handleClick(menu, child.path)}
                      className={clsx(
                        "rounded-md p-1 text-left text-xs sm:p-2",
                        pathname === child.path
                          ? "bg-[#40C3F333] text-[#083A50]"
                          : "text-gray-400 hover:bg-gray-100",
                      )}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CompanySideBar;
