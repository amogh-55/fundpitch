"use client";

import { Card } from "@/components/ui/card";
import { User, Mic, Paperclip, File } from "lucide-react";
import { useState } from "react";
import { api } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";

const HomeContent = () => {
  const [showRequest, setShowRequest] = useState(false);
  const [isInviteTrue, setIsInviteTrue] = useState(false);
  const { data: homeDetails } = api.company.getHomeDetails.useQuery();
  const { data: endorsements } = api.company.getCompanyEndorsements.useQuery();
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [showFiles, setShowFiles] = useState(false);

  const handlePlayAudio = (audioUrl: string) => {
    if (activeAudio === audioUrl) {
      setActiveAudio(null);
      // Stop audio logic here
    } else {
      setActiveAudio(audioUrl);
      // Play audio logic here
    }
  };

  console.log({ homeDetails: homeDetails?.about });
  return (
    <div className="grid h-[calc(100vh-12rem)] grid-cols-1 md:grid-cols-[70%_30%]">
      <Card className="relative h-full rounded-t-[46px] bg-white">
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

      {/* Right Panel - Endorsements */}
      <Card className="translate-x-100 relative h-full rounded-t-[46px] bg-white p-6">
        <div className="absolute left-0 top-0 flex h-16 w-full items-center rounded-t-[45px] bg-[#F6F8FC] px-8">
          <button className="rounded-full bg-white p-3 text-sm text-gray-700 shadow-sm">
            Endorsement
          </button>
          <button className="ml-auto rounded-full bg-white px-6 py-1 text-sm text-gray-700">
            All
          </button>
        </div>

        {/* Endorsement List */}
        <div className="grid grid-cols-1 gap-4 pt-20">
          {endorsements?.map((endorsement) => (
            <div
              key={endorsement.id}
              className="relative rounded-2xl bg-gray-100 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                {/* User Photo */}
                <div className="relative">
                  <img
                    src={endorsement.userPhoto ?? "/assets/images/profile.png"}
                    alt={endorsement.userName ?? ""}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      {endorsement.userName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(
                        new Date(endorsement.createdAt ?? ""),
                        {
                          addSuffix: true,
                        },
                      )}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="mt-1 text-gray-600">{endorsement.message}</p>

                  {/* Audio Player */}
                  {endorsement.audioUrl && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <Mic className="h-4 w-4 text-[#40C3F3]" />
                        <span className="text-sm font-medium">
                          Voice Message
                        </span>
                      </div>
                      <audio
                        controls
                        src={endorsement.audioUrl}
                        className="h-8 w-full"
                      />
                    </div>
                  )}

                  {/* Files */}
                  {endorsement.files && endorsement.files.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowFiles(!showFiles)}
                        className="flex items-center gap-2 text-sm text-blue-500"
                      >
                        <Paperclip size={16} />
                        View Attachments
                      </button>

                      {showFiles && (
                        <div className="mt-2 space-y-2">
                          {endorsement.files?.map((file, index) => (
                            <a
                              key={index}
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-lg bg-white p-2 hover:bg-gray-50"
                            >
                              <File size={16} className="text-blue-500" />
                              <span className="text-sm">
                                Attachment {index + 1}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(!endorsements || endorsements.length === 0) && (
            <div className="py-8 text-center text-gray-500">
              No Endorsements yet
            </div>
          )}
        </div>

        {/* Request History Button */}
        <div
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 transform transition-all duration-500 ${
            showRequest ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <button className="rounded-full bg-gray-100 px-6 py-2 text-gray-700 shadow-lg">
            Request History
          </button>
        </div>

        {/* Arrow Button */}
        <div className="absolute bottom-6 right-6 flex items-center justify-between">
          <button
            className="rounded-full bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            onClick={() => setShowRequest(!showRequest)}
          >
            ↗
          </button>
        </div>
      </Card>
    </div>
  );
};

export default HomeContent;
