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
} from "lucide-react";
import PercentageComponent from "./percentageCom";
import { api } from "@/trpc/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import NotFound from "../../company-overview/_components/not-found";
import { useSearchParams } from "next/navigation";

const UserDetailsCard = ({
  setBio,
  setDoc,
}: {
  setBio: boolean;
  setDoc: boolean;
}) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: details, isLoading } =
    api.overViewProfile.getIndividualDetails.useQuery({
      id: id ?? "",
    });

  const { data: documents, isLoading: isDocumentsLoading } =
    api.overViewProfile.getIndividualDocuments.useQuery({
      id: id ?? "",
    });

  if (isLoading) {
    return <div>..Loading</div>;
  }

  if (!id) {
    return <NotFound />;
  }

  return (
    <div className="mx-auto h-full w-full bg-gray-100">
      <div className="flex flex-col gap-4 px-4 md:flex-row">
        <Card className="flex w-full flex-row items-center gap-8 rounded-lg bg-white p-8 shadow-lg">
          <div className="relative flex h-48 w-48 shrink-0 justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50 md:h-52 md:w-52">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={details?.photo ?? "/assets/images/profile.png"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </Avatar>
          </div>

          <div className="w-[50%]">
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              {details?.name}
            </h1>

            <div className="mx-3 mt-6 grid grid-cols-2 gap-6">
              <div className="">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="h-4 w-4 text-black" />{" "}
                  <span>Designation</span>
                </p>
                <p className="mb-4 pl-6 text-xs text-gray-500">
                  {details?.designation}
                </p>
              </div>
              <div className="">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MailIcon className="h-4 w-4 text-black" /> <span>Email</span>
                </p>
                <p className="mb-4 pl-6 text-xs text-gray-500">
                  {details?.email}
                </p>
              </div>
              <div className="">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="h-4 w-4 text-black" /> <span>Address</span>
                </p>
                <p className="mb-4 pl-6 text-xs text-gray-500">
                  {details?.fullAddress}
                </p>
              </div>
              <div className="">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Phone className="h-4 w-4 text-black" /> <span>Phone</span>
                </p>
                <p className="mb-4 pl-6 text-xs text-gray-500">
                  {details?.contactNumber}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {setBio && (
        <div className="mt-6 flex h-[calc(100vh-20rem)] flex-col">
          <div className="flex h-full flex-col rounded-t-[45px] bg-white shadow-xl">
            <div className="flex h-full flex-col">
              <div className="relative flex h-full flex-col items-start rounded-t-[45px] bg-[#40C3F3]">
                <h2 className="ml-12 p-3 text-lg font-medium text-white">
                  Bio
                </h2>

                <div className="relative z-0 h-full w-full flex-1 rounded-t-[45px] bg-white px-8 py-4">
                  <p className="md:text-inter px-8 pb-12 pt-4 text-sm leading-relaxed text-black">
                    {details?.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {setDoc && (
        <div className="mt-6 flex h-[calc(100vh-20rem)] flex-col">
          <div className="flex h-full flex-col rounded-t-[45px] bg-white shadow-xl">
            <div className="flex h-full flex-col">
              <div className="relative flex h-full flex-col items-start rounded-t-[45px] bg-[#40C3F3]">
                <h2 className="ml-12 p-3 text-lg font-medium text-white">
                  Document
                </h2>
                <div className="relative z-0 h-full w-full flex-1 rounded-t-[45px] bg-white px-8 py-4">
                  <div className="h-full rounded-lg bg-white">
                    <div className="mb-2 grid grid-cols-12 gap-2 rounded-full bg-[#F8F9FA] px-4 py-2 text-sm font-medium text-gray-500">
                      <div className="col-span-6 text-black">Item</div>
                      <div className="col-span-6 text-black">Uploaded</div>
                    </div>

                    <div className="max-h-[calc(100%-3rem)] overflow-y-auto">
                      {(!documents || documents.length === 0) && (
                        <div className="mt-4 flex h-full items-center justify-center">
                          <p className="text-xs text-gray-500">
                            No documents found
                          </p>
                        </div>
                      )}
                      {documents?.map((doc, index) => (
                        <div
                          key={doc.id}
                          className="grid grid-cols-12 gap-2 border-b border-gray-100 p-3 hover:bg-gray-50"
                        >
                          <div className="col-span-6 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span className="truncate text-xs text-black">
                              {`Showcase_${index + 1}`}
                            </span>
                          </div>

                          <div className="col-span-4 text-xs text-gray-500">
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
                          <div className="col-span-2 flex justify-end gap-2">
                            <a
                              href={doc.file ?? ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded p-1 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 text-gray-500" />
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
