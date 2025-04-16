"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Eye, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PendingApprovals = () => {
  const router = useRouter();

  const { data: dashboardData } = api.admin.getDashboardData.useQuery();

  console.log(dashboardData);

  const handleClick = (userType: string, id: string) => {
    router.push(`/admin/company-view?id=${id}`);
  };

  return (
    <div className="rounded-lg bg-white p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Pending Approvals{" "}
          <span className="text-sm sm:text-base text-gray-500">{dashboardData?.pendingData}</span>
        </h2>
        <a
          href="/admin/approvals"
          className="text-xs sm:text-sm text-blue-500 hover:underline"
        >
          View All
        </a>
      </div>

      {/* Approval Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {dashboardData?.dashboardData.map((approval, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 sm:gap-4 rounded-lg bg-white p-3 sm:p-4 shadow-md"
          >
            {/* Logo & Name */}
            <div className="flex items-center space-x-3">
              <img
                src={approval.photo ?? "/assets/images/companylogo.png"}
                alt="Company Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">{approval.name ?? ""}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{approval.userType ?? ""}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex justify-between text-xs sm:text-sm text-gray-700">
              <div className="max-w-[45%]">
                <p className="font-medium mb-0.5 sm:mb-1">Contact Number</p>
                <p className="font-semibold truncate">{approval.contactNumber}</p>
              </div>
              <div className="max-w-[45%]">
                <p className="font-medium mb-0.5 sm:mb-1">Email</p>
                <p className="font-semibold truncate">{approval.email}</p>
              </div>
            </div>

            {/* Approval Status */}
            <div className="flex items-center justify-between rounded-md bg-gray-100 p-2.5 sm:p-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full border-2 border-blue-500">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500"></div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Approval Status
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-blue-600">pending</span>
            </div>

            <div className="flex items-center">
              <Button
                onClick={() =>
                  handleClick(approval.userType ?? "", approval.userId ?? "")
                }
                className="w-full bg-[#40C3F3] h-9 sm:h-10"
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
    </div>
  );
};

export default PendingApprovals;
