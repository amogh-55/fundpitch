"use client";

import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { useState } from "react";
import { api } from "@/trpc/react";
import NotFound from "../not-found";

const HomeContent = ({ id }: { id: string }) => {
  const [showRequest, setShowRequest] = useState(false);
  const [isInviteTrue, setIsInviteTrue] = useState(false);
  const { data: homeDetails } = api.overViewProfile.getHomeDetails.useQuery({
    id,
  });
  console.log({ homeDetails: homeDetails?.about });
  if (!id) return <NotFound />;
  return (
    <div className="grid h-[calc(100vh-12rem)]">
      <Card className="relative h-full w-full rounded-t-[46px] bg-white">
        <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4">
          <h2 className="relative bottom-5 left-10 flex font-normal text-white">
            Company Overview
          </h2>
        </div>
        <div className="absolute top-14 h-[calc(100%-3.5rem)] w-full overflow-y-auto rounded-t-[45px] bg-white p-14 pt-8">
          <p className="text-sm text-black md:text-base">
            {homeDetails?.about}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default HomeContent;
