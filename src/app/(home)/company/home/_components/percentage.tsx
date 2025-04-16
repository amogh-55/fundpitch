"use client";
import { api } from "@/trpc/react";
import { LoaderCircle } from "lucide-react";
import React from "react";

const Companypercentage = ({ id }: { id: string }) => {
  const setUp = api.company.getProfileSetup.useQuery({ id: id });

  console.log({ setUp });

  return (
    <div className="flex flex-col items-center">
      {setUp.isLoading ? (
        <div className="bottom-6 flex items-center justify-center rounded-md bg-white px-2 py-1 font-bold text-[#40C3F3] shadow-md">
          <LoaderCircle className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
        </div>
      ) : (
        <div className="min-w-[60px] rounded-md bg-white px-2 py-1 text-center text-xs font-bold text-[#40C3F3] shadow-md sm:min-w-[70px] sm:px-3 sm:text-sm md:min-w-[80px] md:text-base">
          {setUp.data?.completionPercentage}
        </div>
      )}

      {setUp.data?.completionPercentage !== "100%" && (
        <p className="mt-1 text-center text-[10px] font-medium text-[#787878] sm:mt-2 sm:text-xs">
          Complete the profile
        </p>
      )}
    </div>
  );
};

export default Companypercentage;
