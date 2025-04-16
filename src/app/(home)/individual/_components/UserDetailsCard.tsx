"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  MailIcon,
  Map,
  Eye,
  FileText,
  LoaderCircle,
} from "lucide-react";
import { api } from "@/trpc/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Individualpercentage from "./percentageCom";

const UserDetailsCard = ({
  setBio,
  setDoc,
}: {
  setBio: boolean;
  setDoc: boolean;
}) => {
  const { data: details, isLoading } =
    api.individual.getIndividualDetails.useQuery();

  const { data: documents, isLoading: isDocumentsLoading } =
    api.individual.getIndividualDocuments.useQuery();

  const { data: user } = api.user.getUser.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto h-full w-full bg-gray-100">
      <div className="flex flex-col gap-4 px-2 sm:px-4 md:flex-row">
        <Card className="flex w-full flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-lg sm:p-6 md:flex-row md:gap-8 md:p-8">
          <div className="relative flex flex-col items-center">
            <span className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-[#40C3F3] bg-white text-center sm:h-44 sm:w-44 md:h-52 md:w-52">
              <img
                src={details?.photo ?? "/assets/images/companylogo.png"}
                alt="Profile Picture"
                className="h-full w-full cursor-pointer rounded-full object-cover"
              />
            </span>
            <div className="relative bottom-5">
              <Individualpercentage id={user?.id ?? ""} />
            </div>
          </div>

          <div className="mt-8 w-full md:mt-0 md:w-[60%] lg:w-[65%]">
            <h1 className="text-center text-lg font-bold text-gray-800 sm:text-xl md:text-left md:text-2xl lg:text-3xl">
              {details?.name}
            </h1>

            <div className="mx-0 mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3 md:mt-5 md:gap-4">
              <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 sm:gap-2 sm:text-sm">
                  <User className="h-3 w-3 text-black sm:h-4 sm:w-4" />
                  <span>Designation</span>
                </p>
                <p className="pl-5 text-[11px] text-gray-500 sm:pl-6 sm:text-xs md:text-sm">
                  {details?.designation}
                </p>
              </div>
              <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 sm:gap-2 sm:text-sm">
                  <MailIcon className="h-3 w-3 text-black sm:h-4 sm:w-4" />
                  <span>Email</span>
                </p>
                <p className="max-w-[200px] truncate pl-5 text-[11px] text-gray-500 sm:max-w-[240px] sm:pl-6 sm:text-xs md:max-w-[280px] md:text-sm lg:max-w-[320px] xl:max-w-none">
                  {details?.email}
                </p>
              </div>
              <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 sm:gap-2 sm:text-sm">
                  <MapPin className="h-3 w-3 text-black sm:h-4 sm:w-4" />
                  <span>Address</span>
                </p>
                <p className="pl-5 text-[11px] text-gray-500 sm:pl-6 sm:text-xs md:text-sm">
                  {details?.fullAddress}
                </p>
              </div>
              <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 sm:gap-2 sm:text-sm">
                  <Phone className="h-3 w-3 text-black sm:h-4 sm:w-4" />
                  <span>Phone</span>
                </p>
                <p className="pl-5 text-[11px] text-gray-500 sm:pl-6 sm:text-xs md:text-sm">
                  {details?.contactNumber}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {setBio && (
        <div className="mt-3 flex h-[calc(100vh-18rem)] flex-col sm:mt-4 sm:h-[calc(100vh-20rem)] md:mt-6">
          <div className="mb-4 flex h-full flex-col rounded-t-[20px] bg-white sm:mb-0 sm:rounded-t-[25px] md:rounded-t-[35px]">
            <div className="flex h-full flex-col">
              <div className="relative flex h-full flex-col items-start rounded-t-[20px] bg-[#40C3F3] sm:rounded-t-[25px] md:rounded-t-[35px]">
                <h2 className="ml-4 p-1.5 text-sm font-medium text-white sm:ml-6 sm:p-2 sm:text-base md:ml-8 md:p-3 md:text-lg">
                  Bio
                </h2>

                <div className="relative z-0 h-full w-full flex-1 rounded-t-[20px] bg-white px-3 py-2 sm:rounded-t-[25px] sm:px-4 sm:py-3 md:rounded-t-[35px] md:px-6 md:py-4">
                  <div className="md:text-inter overflow-y-auto px-2 pb-6 pt-2 text-[11px] leading-relaxed text-black sm:px-4 sm:pb-8 sm:pt-3 sm:text-xs md:px-6 md:pb-10 md:pt-4 md:text-sm">
                    {details?.bio}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {setDoc && (
        <div className="mt-3 flex h-[calc(100vh-18rem)] flex-col sm:mt-4 sm:h-[calc(100vh-20rem)] md:mt-6">
          <div className="flex h-full flex-col rounded-t-[20px] bg-white sm:rounded-t-[25px] md:rounded-t-[35px]">
            <div className="flex h-full flex-col">
              <div className="relative flex h-full flex-col items-start rounded-t-[20px] bg-[#40C3F3] sm:rounded-t-[25px] md:rounded-t-[35px]">
                <h2 className="ml-4 p-1.5 text-sm font-medium text-white sm:ml-6 sm:p-2 sm:text-base md:ml-8 md:p-3 md:text-lg">
                  Document
                </h2>
                <div className="relative z-0 h-full w-full flex-1 rounded-t-[20px] bg-white px-2 py-2 sm:rounded-t-[25px] sm:px-4 sm:py-3 md:rounded-t-[35px] md:px-6 md:py-4">
                  <div className="h-full rounded-lg bg-white">
                    <div className="mb-2 grid grid-cols-12 gap-2 rounded-full bg-[#F8F9FA] px-2 py-1.5 text-[11px] font-medium text-gray-500 sm:px-3 sm:py-2 sm:text-xs md:text-sm">
                      <div className="col-span-6 text-black">Item</div>
                      <div className="col-span-6 text-black">Uploaded</div>
                    </div>

                    <div className="max-h-[calc(100%-3rem)] overflow-y-auto">
                      {(!documents || documents.length === 0) && (
                        <div className="mt-4 flex h-full items-center justify-center">
                          <p className="text-[11px] text-gray-500 sm:text-xs">
                            No documents found
                          </p>
                        </div>
                      )}
                      {documents?.map((doc, index) => (
                        <div
                          key={doc.id}
                          className="grid grid-cols-12 gap-2 border-b border-gray-100 p-1.5 hover:bg-gray-50 sm:p-2 md:p-3"
                        >
                          <div className="col-span-6 flex items-center gap-1 sm:gap-2">
                            <FileText className="h-3 w-3 text-gray-400 sm:h-4 sm:w-4" />
                            <span className="truncate text-[11px] text-black sm:text-xs md:text-sm">
                              {`Showcase_${index + 1}`}
                            </span>
                          </div>

                          <div className="col-span-4 text-[10px] text-gray-500 sm:text-xs">
                            {doc.createdAt
                              ? new Date(doc.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : ""}
                          </div>
                          <div className="col-span-2 flex justify-end gap-1 sm:gap-2">
                            <a
                              href={doc.file ?? ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded p-0.5 hover:bg-gray-100 sm:p-1"
                            >
                              <Eye className="h-3 w-3 text-gray-500 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsCard;
