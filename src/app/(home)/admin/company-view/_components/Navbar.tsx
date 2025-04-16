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
  XCircle,
  CheckCircle,
  Trash,
  Loader2,
} from "lucide-react";
import LogoutButton from "@/app/(home)/_components/LogoutButton";
import NotificationContent from "./notification-content";
import { api } from "@/trpc/react";
import NotFound from "./not-found";
import { useToast } from "@/components/ui/use-toast";

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
  {
    name: "Subsidiaries",
    icon: <Building className="mr-1 h-5 w-5" />,
  },
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
  const getUser = api.user.getUser.useQuery();
  const { toast } = useToast();
  const utils = api.useUtils();

  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const userType = getUser.data?.userType;
  const [showExpressionModal, setShowExpressionModal] = useState(false);
  const [showEndorseModal, setShowEndorseModal] = useState(false);
  const isUser = userType !== "company-founder" && userType !== "admin";
  const isAdmin = userType === "admin";
  const { data, isLoading } =
    api.companyNotification.getInviteHistoryCount.useQuery();

  const { data: companyDetails } = api.admin.getCompanyDetails.useQuery(id);

  const approveMutation = api.admin.approveCompany.useMutation({
    onSuccess: () => {
      toast({
        title: "Company approved successfully",
      });
      void utils.companyNotification.getInviteHistoryCount.invalidate();
    },
  });
  const rejectMutation = api.admin.rejectCompany.useMutation({
    onSuccess: () => {
      toast({
        title: "Company rejected successfully",
      });
      void utils.companyNotification.getInviteHistoryCount.invalidate();
    },
  });

  const handleNavClick = (name: string) => {
    onTabChange(name);
  };

  if (!id) return <NotFound />;

  return (
    <header className="relative rounded-xl bg-transparent p-2 px-4">
      <nav className="hidden justify-between overflow-x-auto px-4 pt-10 md:flex">
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`flex items-center whitespace-nowrap rounded-2xl px-2 py-1.5 text-xs transition-all ${
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
        <div>
          {" "}
          {isAdmin && (
            <div className="mt-4 flex gap-4 md:mt-0">
              {companyDetails?.isApproved === false ? (
                <>
                  <button
                    onClick={() => approveMutation.mutate(id)}
                    className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-600 active:scale-95"
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(id)}
                    className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-600 active:scale-95"
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash className="h-4 w-4" />
                        Reject
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-medium text-white">
                  <CheckCircle className="h-4 w-4" />
                  Approved
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
