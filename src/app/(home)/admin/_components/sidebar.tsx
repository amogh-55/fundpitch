"use client";
import { ClipboardList, Home, Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Approvals",
    path: "/admin/approvals",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    name: "Companies",
    path: "/admin/companies",
    icon: <Building2 className="h-5 w-5" />,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex md:flex-col">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`group flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-[#40C3F333] md:mb-1 
            ${pathname === item.path ? "bg-[#40C3F333] text-[#40C3F3]" : "text-gray-700"}
          `}
        >
          <div className="flex items-center gap-3">
            {React.cloneElement(item.icon, {
              className: `h-5 w-5 transition-colors ${pathname === item.path ? "text-[#40C3F3]" : "text-gray-500 group-hover:text-[#40C3F3]"}`,
            })}
            <span className={`hidden text-sm font-medium md:block group-hover:text-[#40C3F3]`}>
              {item.name}
            </span>
            <span className={`text-xs font-medium md:hidden group-hover:text-[#40C3F3]`}>
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AdminSidebar;
