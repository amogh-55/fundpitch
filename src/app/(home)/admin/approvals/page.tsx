"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="rounded-lg bg-green-5 bg-gray-100 p-10 shadow-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Approvals{" "}
          <span className="text-gray-500">{dashboardData?.pendingData}</span>
        </h2>
      </div>

      {/* Approval Cards Grid */}
      <Card className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 min-h-400px overflow-y-auto">
        {dashboardData?.dashboardData.map((approval, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-lg bg-white p-2 shadow-md"
          >
            {/* Logo & Name */}
            <div className="flex items-center space-x-3">
              <img
                src={approval.photo ?? "/assets/images/companylogo.png"}
                alt="Company Logo"
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{approval.name}</h3>
                <p className="text-sm text-gray-500">{approval.userType}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex justify-between text-xs text-gray-700">
              <div>
                <p className="font-medium">Contact Number</p>
                <p className="font-semibold">{approval.contactNumber}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="font-semibold">{approval.email}</p>
              </div>
            </div>

            {/* Approval Status */}
            <div className="flex items-center justify-between rounded-md bg-gray-100 p-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-blue-500">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <span className="font-medium text-gray-600">
                  Approval Status
                </span>
              </div>
              <span className="font-semibold text-blue-600">pending</span>
            </div>

            <div className="flex items-center">
              <Button
                onClick={() =>
                  handleClick(approval.userType ?? "", approval.userId ?? "")
                }
                className="w-full bg-[#40C3F3]"
              >
                <div className="flex flex-row items-center gap-2">
                  <span>
                    <Eye />
                  </span>
                  View Profile
                </div>
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default PendingApprovals;
