"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Eye, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
const CompaniesPage = () => {
  const router = useRouter();
  const { data: dashboardData } = api.admin.getCompanyData.useQuery();

  const handleClick = (userType: string, id: string) => {
    router.push(`/admin/company-view?id=${id}`);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-2 lg:gap-6">
      {dashboardData?.dashboardData.map((approval, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-lg bg-white p-3 shadow-md sm:gap-4 sm:p-4"
        >
          {/* Logo & Name */}
          <div className="flex items-center space-x-3">
            <img
              src={approval.photo ?? "/assets/images/companylogo.png"}
              alt="Company Logo"
              className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                {approval.name ?? ""}
              </h3>
              <p className="text-xs text-gray-500 sm:text-sm">
                {approval.userType ?? ""}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex justify-between text-xs text-gray-700 sm:text-sm">
            <div className="max-w-[45%]">
              <p className="mb-0.5 font-medium sm:mb-1">Contact Number</p>
              <p className="truncate font-semibold">{approval.contactNumber}</p>
            </div>
            <div className="max-w-[45%]">
              <p className="mb-0.5 font-medium sm:mb-1">Email</p>
              <p className="truncate font-semibold">{approval.email}</p>
            </div>
          </div>

          {/* Approval Status */}
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3 shadow-sm transition-all hover:shadow-md sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-0.5 animate-pulse rounded-full bg-blue-200"></div>
                <div className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-500 bg-white sm:h-6 sm:w-6">
                  <div className="h-2 w-2 rounded-full bg-blue-500 sm:h-2.5 sm:w-2.5"></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 sm:text-base">
                Approval Status
              </span>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold sm:text-base ${
                approval.isApproved
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {approval.isApproved ? "Approved" : "Pending"}
            </span>
          </div>

          <div className="flex items-center">
            <Button
              onClick={() =>
                handleClick(approval.userType ?? "", approval.userId ?? "")
              }
              className="h-9 w-full bg-[#40C3F3] sm:h-10"
            >
              <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-2">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">View Profile</span>
              </div>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompaniesPage;
