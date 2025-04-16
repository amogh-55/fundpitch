"use client";
import { Fragment, useRef } from "react";
import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import NotFound from "../not-found";
const BusinessVerticalsContent = ({ id }: { id: string }) => {
  const scrollContainerRef = useRef(null);
  const { data: businessVerticalDetails } =
    api.overViewProfile.getBusinessVerticalDetails.useQuery({
      id,
    });
  console.log(businessVerticalDetails);

  if (!id) return <NotFound />;
  return (
    <Fragment>
      <div className="flex h-[calc(100vh-6rem)] flex-col">
        <Card className="relative h-full rounded-t-[46px] bg-white">
          <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4">
            <h2 className="relative bottom-5 left-10 flex font-normal text-white">
              Business Verticals
            </h2>
          </div>

          <div className="absolute top-14 h-[calc(100%-3.5rem)] w-full overflow-y-auto rounded-t-[45px] bg-white p-14 pt-8">
            <div
              ref={scrollContainerRef}
              className="scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-300 custom-scrollbar flex space-x-4 overflow-x-auto pb-10"
            >
              {businessVerticalDetails?.map((detail, index) => (
                <div
                  key={index}
                  className="mx-5 min-w-[300px] rounded-xl bg-[#F6F8FC] p-8 md:min-w-[350px] lg:min-w-[400px]"
                >
                  <div className="mb-5 flex flex-row items-center gap-1 space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black">
                      <div className="h-3 w-3 rounded-full bg-black"></div>
                    </div>
                    <h3 className="font-semibold">
                      {detail.nameOfTheBusinessVertical}
                    </h3>
                  </div>
                  <p className="pl-7 text-sm text-[#868DA6]">{detail.about}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};

export default BusinessVerticalsContent;
