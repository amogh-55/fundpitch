/* eslint-disable @next/next/no-img-element */
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
  FileText,
  ThumbsUp,
  HandCoins,
  XCircle,
  CheckCircle,
} from "lucide-react";
import PercentageComponent from "./PercentageComponent";
import { api } from "@/trpc/react";
import NotFound from "./not-found";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const CompanyDetailsCard = ({ id }: { id: string }) => {
  const getUser = api.user.getUser.useQuery();
  const router = useRouter();
  const userType = getUser.data?.userType;
  const [showExpressionModal, setShowExpressionModal] = useState(false);
  const [showEndorseModal, setShowEndorseModal] = useState(false);
  const isUser = userType !== "company-founder" && userType !== "admin";
  const isAdmin = userType === "admin";

  const { data: companyDetails, isLoading } =
    api.overViewProfile.getBasicDetails.useQuery({
      id,
    });

  console.log({ id, companyDetails });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (getUser.isLoading) {
    return <div>Loading...</div>;
  }

  if (!getUser.data) {
    router.push("/login");
  }

  if (!id) return <NotFound />;

  return (
    <>
      <div className="bg-gray-100 p-4 md:p-6">
        <Card className="relative flex flex-col items-center gap-16 p-4 md:flex-row md:p-6">
          <div className="relative flex h-48 w-48 shrink-0 justify-center overflow-hidden bg-gray-50 rounded-full border-2 border-gray-200 md:h-52 md:w-52">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={companyDetails?.photo ?? "/assets/images/companylogo.png"}
                alt="TCS Logo"
                className="h-full w-full object-cover"
              />
            </Avatar>
          </div>
          <div className="w-full flex-1">
            {/* Title Section */}
            <div className="flex flex-col items-center justify-between md:flex-row">
              <h1 className="text-2xl font-bold text-gray-600 md:text-3xl">
                {companyDetails?.companyName}
              </h1>
            </div>

            {/* Information Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {/* Type */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <User className="h-4 w-4 text-sm text-gray-500" />{" "}
                  <p className="text-sm">Type</p>
                </p>
                <p className="mb-4 pl-6 text-xs text-gray-500">
                  {companyDetails?.class}
                </p>
              </div>

              {/* Industry */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Briefcase className="text h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Industry</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.sectors}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail className="h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Email</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.companyEmailID}
                </p>
              </div>

              {/* Address */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin className="h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Address</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.companyAddress}
                </p>
              </div>

              {/* Office Phone */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Phone className="h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Office Phone</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.officePhone}
                </p>
              </div>

              {/* Website */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Globe className="h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Website</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.companyWebsiteURL}
                </p>
              </div>

              {/* Market Cap */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BarChartBig className="h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Market Cap</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.marketCapital}
                </p>
              </div>

              {/* Stage */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <TrendingUp className="h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Stage</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.stage}
                </p>
              </div>

              {/* Founded Year */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar className="h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Founded Year</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.yearOfIncorporation}
                </p>
              </div>

              {/* Registration Number */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText className="h-4 w-4 text-gray-500" />{" "}
                  <p className="text-sm">Registration Number</p>
                </p>
                <p className="pl-6 text-xs text-gray-500">
                  {companyDetails?.registartionNumber}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CompanyDetailsCard;
