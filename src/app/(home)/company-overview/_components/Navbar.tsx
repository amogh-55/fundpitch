// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useRouter } from "next/navigation";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// import {
//   Search,
//   Bell,
//   User,
//   Menu,
//   X,
//   Home,
//   Users,
//   Building,
//   FileText,
//   Clock,
//   Box,
//   BarChart,
//   HandCoins,
//   Star,
//   UserCog,
//   LogOut,
//   ArrowLeft,
// } from "lucide-react";
// import LogoutButton from "@/app/(home)/_components/LogoutButton";
// import NotificationContent from "./notification-content";
// import { api } from "@/trpc/react";

// const navItems = [
//   {
//     name: "Home",
//     icon: <Home className="mr-1 h-5 w-5" />,
//   },
//   {
//     name: "Teams",
//     icon: <Users className="mr-1 h-5 w-5" />,
//   },
//   {
//     name: "Business Verticals",
//     icon: <Star className="mr-1 h-5 w-5" />,
//   },
//   {
//     name: "Subsidiaries",
//     icon: <Building className="mr-1 h-5 w-5" />,
//   },
//   {
//     name: "Documents",
//     icon: <FileText className="mr-1 h-5 w-5" />,
//   },
//   // {
//   //   name: "Timeline",
//   //   icon: <Clock className="mr-1 h-5 w-5" />,
//   // },
//   // {
//   //   name: "Invite Journey",
//   //   icon: <Users className="mr-1 h-5 w-5" />,
//   // },
//   {
//     name: "Product",
//     icon: <Box className="mr-1 h-5 w-5" />,
//   },
//   // {
//   //   name: "Analytics",
//   //   icon: <BarChart className="mr-1 h-5 w-5" />,
//   // },
//   // {
//   //   name: "Expressions",
//   //   icon: <HandCoins className="mr-1 h-5 w-5" />,
//   // },
// ];

// interface NavbarProps {
//   onTabChange: (tab: string) => void;
//   activeTab: string;
// }

// const Navbar = ({ onTabChange, activeTab }: NavbarProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const router = useRouter();

//   const { data, isLoading } =
//     api.companyNotification.getInviteHistoryCount.useQuery();

//   const handleNavClick = (name: string) => {
//     onTabChange(name);
//   };

//   return (
//     <header className="relative rounded-xl bg-transparent p-2 px-4">
//       {/* Logo */}
//       <div className="flex items-center gap-2">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-95"
//         >
//           <ArrowLeft className="h-5 w-5 text-gray-600" />
//           <span className="font-medium">Back to Home</span>
//         </Button>
//       </div>

//       {/* Desktop Navigation */}
//       <nav className="hidden justify-center space-x-2 overflow-x-auto px-4 md:flex">
//         {navItems.map((item) => (
//           <Button
//             key={item.name}
//             variant="ghost"
//             className={`flex items-center whitespace-nowrap rounded-2xl px-2 py-1.5 text-xs transition-all ${
//               activeTab === item.name
//                 ? "bg-[#40C3F3] text-white"
//                 : "bg-white hover:bg-[#40C3F3] hover:text-white"
//             }`}
//             onClick={() => handleNavClick(item.name)}
//           >
//             {item.icon}
//             {item.name}
//           </Button>
//         ))}
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
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
  ArrowLeft,
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
  // {
  //   name: "Invite Journey",
  //   icon: <Users className="mr-1 h-5 w-5" />,
  // },
  {
    name: "Product",
    icon: <Box className="mr-1 h-5 w-5" />,
  },
  // {
  //   name: "Analytics",
  //   icon: <BarChart className="mr-1 h-5 w-5" />,
  // },
  // {
  //   name: "Expressions",
  //   icon: <HandCoins className="mr-1 h-5 w-5" />,
  // },
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
    <header className="relative rounded-xl p-2 px-4">
      {/* Logo */}
      <div className="mb-3 flex items-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
          <span className="font-medium">Back to Home</span>
        </Button>
      </div>

      {/* Desktop Navigation - Fixed for better scrolling */}
      <div className="mt-2 w-full overflow-x-auto md:mt-0">
        <nav className="flex min-w-max py-2">
          <div className="flex space-x-2 px-4 md:mx-auto">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`flex min-w-fit items-center whitespace-nowrap rounded-2xl px-2 py-1.5 text-xs transition-all ${
                  activeTab === item.name
                    ? "bg-[#40C3F3] text-white"
                    : "bg-white hover:bg-[#40C3F3] hover:text-white"
                }`}
                onClick={() => handleNavClick(item.name)}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
