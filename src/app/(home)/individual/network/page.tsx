"use client";
import React from "react";
import {
  Home,
  ClipboardList,
  Users,
  Building2,
  Settings,
  BellDot,
  CalendarClockIcon,
  CheckCircle,
  Clock,
} from "lucide-react";
import Navbar from "../_components/Navbar";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <main className="relative flex flex-1 flex-col gap-16 overflow-x-hidden overflow-y-scroll">
        <div className="relative top-5">
          <Navbar />
        </div>

        <div className="px-4">
          <div className="w-full">
            <NetworkCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

const NetworkCard = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: networks, isLoading } = api.individual.getNetwork.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-[1600px] rounded-xl bg-white p-4 shadow-xl sm:p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3 2xl:grid-cols-4">
          {networks?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center">
              <Users className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No Networks Found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                You haven&apos;t connected with any companies yet.
              </p>
              <p className="text-sm text-gray-500">
                Your professional network will appear here once you start
                connecting.
              </p>
            </div>
          )}
          {networks?.map((network) => (
            <Card
              key={network.id}
              onClick={() => {
                if (network.isUserApproved) {
                  router.push(`/company-overview?id=${network.userId}`);
                } else {
                  toast({
                    title: "Access Restricted",
                    description:
                      "You can view the details once the founder approves your request",
                    variant: "destructive",
                  });
                }
              }}
              className={`group relative h-full w-full rounded-xl bg-white p-4 shadow-md transition-all duration-300 sm:p-5 lg:p-6 ${
                network.isUserApproved
                  ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg"
                  : "cursor-not-allowed"
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5">
                <div className="sm:h-18 sm:w-18 relative h-16 w-16 shrink-0 lg:h-20 lg:w-20">
                  <Image
                    src={network.photo ?? "/assets/images/companylogo.png"}
                    alt={`${network.name} Logo`}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                    {network.name}
                  </h4>
                  {network.designation && (
                    <p className="truncate text-sm text-gray-600">
                      {network.designation}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4 lg:mt-6 lg:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Contact Number
                  </p>
                  <p className="break-words text-sm font-semibold text-gray-900">
                    {network.contactNumber ?? "N/A"}
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="truncate break-words text-sm font-semibold text-gray-900">
                    {network.address ?? "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-3 rounded-lg bg-gray-50 p-3 sm:mt-5 sm:p-4 lg:mt-6">
                <Image
                  src="/assets/images/menu.png"
                  alt="Email Icon"
                  width={20}
                  height={20}
                  className="shrink-0 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Company Email
                  </p>
                  <p className="truncate text-sm text-gray-600">
                    {network.email ?? "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:mt-5 sm:p-4 lg:mt-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#40C3F3] p-1 sm:h-7 sm:w-7">
                    <div className="h-3 w-3 rounded-full bg-[#40C3F3] sm:h-3.5 sm:w-3.5"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Connection Status
                  </p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {network.isUserApproved ? "Connected" : "Pending"}
                  </span>
                  {network.isUserApproved ? (
                    <CheckCircle
                      size={14}
                      className="text-green-500 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
                    />
                  ) : (
                    <Clock
                      size={14}
                      className="text-yellow-500 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
