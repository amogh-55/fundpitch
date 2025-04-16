import { api } from "@/trpc/react";
import { LoaderCircle } from "lucide-react";
import React from "react";

function Individualpercentage({ id }: { id: string }) {
  const setUp = api.individual.getProfileSetup.useQuery({ id: id });

  return (
    <div>
      {setUp.isLoading ? (
        <div className="bottom-6 flex items-center justify-center rounded-md bg-white px-2 py-1 font-bold text-[#40C3F3] shadow-md">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <div className="-bottom-2 rounded-md bg-white px-3 py-1 font-bold text-[#40C3F3] shadow-md">
          {setUp.data?.completionPercentage}
        </div>
      )}

      {setUp.data?.completionPercentage !== "100%" && (
        <p className="mt-2 text-center text-xs font-medium text-[#787878] sm:mt-2">
          Complete the profile
        </p>
      )}
    </div>
  );
}

export default Individualpercentage;
