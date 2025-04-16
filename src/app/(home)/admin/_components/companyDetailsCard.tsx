"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  User,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  Globe,
  BarChartBig,
  TrendingUp,
  Calendar,
} from "lucide-react";
import InviteModal from "./inviteModal";
import { api } from "@/trpc/react";

const AdminCompanyDetails = ({ id }: { id: string }) => {
  const { data: getHomeDetails, isLoading } =
    api.admin.getCompanyHomeDetails.useQuery(id);

  console.log(getHomeDetails);

  const [isInviteTrue, setIsInviteTrue] = useState(false);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <>
      {isInviteTrue ? (
        <div className="overflow-hidden">
          <InviteModal
            show={isInviteTrue}
            onClose={() => setIsInviteTrue(false)}
          />
        </div>
      ) : (
        ""
      )}
      <div className="bg-gray-100 p-4 md:p-6">
        <Card className="relative flex flex-col items-center gap-16 p-4 shadow-sm shadow-[#3a4ee91c] md:flex-row md:p-4">
          {/* Invite Individuals Button */}
          <div className="absolute right-4 h-44"></div>

          {/* Image Div */}
          <div className="h-full w-[20%]">
            <img
              src={getHomeDetails?.photo ?? "/assets/images/companylogo.png"}
              alt="TCS Logo"
              className="h-full w-full rounded-xl object-cover md:w-full"
            />
          </div>

          {/* Details and Grid Div */}
          <div className="h-full w-[80%]">
            {/* Title Section */}
            <div className="flex flex-col items-center justify-between md:flex-row">
              <h1 className="text-2xl font-bold text-gray-600 md:text-3xl">
                {getHomeDetails?.companyName}
              </h1>
            </div>

            {/* Information Grid */}
            <div className="mt-8 grid grid-cols-5 gap-8 break-words text-xs">
              {/* Column 1 */}

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <User className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">Type</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.class}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">Email</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.companyEmailID}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Phone className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">Office Phone</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.officePhone}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BarChartBig className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">Market Cap</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.marketCapital}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">Founded year</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.yearOfIncorporation}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Briefcase className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">Industry</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.sectors}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">Address</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.companyAddress}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Globe className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">WebSite</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.companyWebsiteURL}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <TrendingUp className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <div className="text-sm">Stage</div>
                </div>
                <div className="mb-4 pl-6 text-xs text-gray-500">
                  {getHomeDetails?.stage}
                </div>
              </div>
            </div>
          </div>

          {/* Percentage Div */}
        </Card>
      </div>
    </>
  );
};

export default AdminCompanyDetails;
