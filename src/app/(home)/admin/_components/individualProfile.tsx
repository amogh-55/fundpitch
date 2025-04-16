/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { User, Briefcase, Mail, Phone, Trash2, Settings } from "lucide-react";
import { api } from "@/trpc/react";

const AdminProfileDetails = ({ id }: { id: string }) => {
  const { data: getHomeDetails, isLoading } =
    api.admin.getIndividualDetails.useQuery(id);

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <div className="mx-auto md:p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Left Card - Larger */}
        <Card className="flex flex-row items-center gap-6 p-4 shadow-sm shadow-[#3a4ee91c] md:w-2/3 md:flex-row md:items-start md:p-6">
          {/* Image Section */}
          <div className="flex w-full justify-center md:w-1/3 md:justify-start">
            <img
              src={getHomeDetails?.photo ?? ""}
              alt="TCS Logo"
              className="h-auto w-40 rounded-full object-cover md:w-64"
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2">
            {/* Title Section */}
            <h1 className="text-2xl font-bold text-gray-600 md:text-3xl">
              {getHomeDetails?.name}
            </h1>

            {/* Information Grid */}
            <div className="mt-8 grid grid-cols-2 gap-x-4">
              {/* Column 1 */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <User className="h-4 w-4 text-gray-500" />{" "}
                  <span>Designation</span>
                </p>
                <p className="mb-4 pl-2 text-xs text-gray-500">
                  {getHomeDetails?.designation}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Briefcase className="h-4 w-4 text-gray-500" />{" "}
                  <span>Address</span>
                </p>
                <p className="pl-2 text-xs text-gray-500">
                  {getHomeDetails?.fullAddress}
                </p>
              </div>

              {/* Column 2 */}
              <div className="pr-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail className="h-4 w-4 text-gray-500" /> <span>Email</span>
                </p>
                <p className="mb-4 w-full pl-2 text-xs text-gray-500">
                  {getHomeDetails?.email}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Phone className="h-4 w-4 text-gray-500" /> <span>Phone</span>
                </p>
                <p className="pl-2 text-xs text-gray-500">
                  {getHomeDetails?.contactNumber}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Card - Smaller */}
        <Card className="flex flex-col items-center p-4 shadow-sm shadow-[#3a4ee91c] md:w-1/3 md:p-6">
          <div className="mb-2 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-orange-600">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium">
                1 / 3 Changes are done
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center justify-center gap-5">
            <div className="flex flex-row items-center justify-center gap-5">
              <span className="flex cursor-pointer flex-col gap-2 rounded-xl px-8 py-5 shadow-xl">
                <img
                  src="/assets/images/admininvestor.png"
                  alt=""
                  className="h-10 w-10"
                />
                <p className="text-xs text-[#40C3F3]">Investor</p>
              </span>
              <img
                src="/assets/images/gradient_bar.png"
                alt=""
                className="h-1 w-24"
              />

              <span className="flex cursor-pointer flex-col gap-2 rounded-xl px-8 py-5 shadow-xl">
                <img
                  src="/assets/images/adminmerchnat.png"
                  alt=""
                  className="h-10 w-10"
                />
                <p className="text-xs text-[#40C3F3]">Investor</p>
              </span>
            </div>

            <span className="flex flex-row gap-5">
              <button className="flex items-center gap-2 rounded-full bg-[#F8564D] px-8 py-2 text-white hover:bg-red-600">
                Reject
                <Trash2 className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-2 rounded-full bg-[#2AAC7E] px-8 py-2 text-white hover:bg-green-600">
                Approve
                <img
                  src="/assets/images/approve.png"
                  alt=""
                  className="h-4 w-4"
                />
                {/* <Settings className="w-5 h-5" /> */}
              </button>
            </span>
          </div>
          {/* <p className="text-gray-500 mt-4 text-sm text-center">
            This is the second card for extra details. You can add content here.
          </p> */}
        </Card>
      </div>
    </div>
  );
};

export default AdminProfileDetails;
