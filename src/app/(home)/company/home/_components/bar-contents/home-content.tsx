"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight,
  Dot,
  ChevronDown,
  CalendarClockIcon,
  Mic,
  Paperclip,
  File,
} from "lucide-react";
import { useState, useRef } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import ViewModal from "../ViewModal";
import { formatDistanceToNow } from "date-fns";
import { type Endorsement } from "../ViewModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const HomeContent = () => {
  const [showRequest, setShowRequest] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeInviteIndex, setActiveInviteIndex] = useState<number | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [showInviteHistory, setShowInviteHistory] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedEndorsement, setSelectedEndorsement] =
    useState<Endorsement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [activeEndorsementIndex, setActiveEndorsementIndex] = useState<
    number | null
  >(null);

  const [isInviteTrue, setIsInviteTrue] = useState(false);
  const { data: homeDetails } = api.company.getHomeDetails.useQuery();
  const { data: endorsements } = api.company.getCompanyEndorsements.useQuery();
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [showFiles, setShowFiles] = useState(false);

  const { data: inviteHistory } =
    api.companyNotification.getInviteHistory.useQuery();

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        void audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };

  const handleNavigation = (link: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent hiding the button
    router.push(link);
  };

  const openModal = (endorsement: Endorsement) => {
    setSelectedEndorsement(endorsement);
    setIsModalOpen(true);
  };

  const handlePlayAudio = (audioUrl: string) => {
    if (activeAudio === audioUrl) {
      setActiveAudio(null);
      // Stop audio logic here
    } else {
      setActiveAudio(audioUrl);
      // Play audio logic here
    }
  };

  return (
    <div className="grid h-full grid-cols-1 gap-0 px-4 py-4 md:grid-cols-[70%_30%] md:gap-0 md:px-6 lg:gap-0 lg:px-8">
      <Card className="relative mb-0 h-auto min-h-[200px] rounded-t-[46px] bg-white pb-16 sm:min-h-[250px] sm:pb-20 md:mb-0 md:min-h-[300px] md:pb-24 lg:min-h-[350px]">
        <div className="absolute left-0 top-0 flex h-16 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4 sm:h-20 md:h-24">
          <h2 className="relative bottom-2 left-4 flex font-normal text-white sm:bottom-3 sm:left-6 md:bottom-5 md:left-10">
            Company Overview
          </h2>
        </div>
        <div className="absolute top-10 w-full rounded-t-[45px] bg-white p-6 pt-6 sm:top-12 md:top-14 md:p-10 md:pt-8 lg:p-14">
          <p className="text-xs text-black sm:text-sm md:text-base">
            {homeDetails?.about}
          </p>
        </div>
      </Card>

      <Card className="relative rounded-t-[46px] bg-[#F6F8FC]">
        <button className="m-3 rounded-full bg-white px-3 py-2 text-xs text-gray-700 sm:m-4 sm:px-4 sm:py-3 sm:text-sm">
          Endorsement
        </button>

        <div className="rounded-t-[45px] bg-white">
          {!showInviteHistory && (
            <div className="mb-2 flex max-h-[250px] flex-col gap-3 overflow-y-auto p-3 sm:max-h-[300px] sm:gap-4 sm:p-4 md:p-6">
              {endorsements?.map((endorsement, index) => (
                <div
                  key={endorsement.id}
                  className="relative flex cursor-pointer flex-row"
                >
                  <div
                    className={`relative cursor-pointer rounded-2xl bg-gray-100 p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4 ${activeEndorsementIndex === index ? "w-10/12" : "w-full"}`}
                    onClick={() =>
                      setActiveEndorsementIndex(
                        activeEndorsementIndex === index ? null : index,
                      )
                    }
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      {/* User Photo */}
                      <div className="relative">
                        <img
                          src={
                            endorsement.userPhoto ??
                            "/assets/images/profile.png"
                          }
                          alt={endorsement.userName ?? ""}
                          className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10 md:h-12 md:w-12"
                        />
                        <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-green-500 sm:h-3 sm:w-3" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3 className="truncate text-sm font-semibold text-gray-800 sm:text-base">
                            {endorsement.userName}
                          </h3>
                          <span className="ml-1 text-xs text-gray-500 sm:text-sm">
                            {formatDistanceToNow(
                              new Date(endorsement.createdAt ?? ""),
                              {
                                addSuffix: true,
                              },
                            )}
                          </span>
                        </div>

                        {/* Message */}
                        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                          {endorsement.message}
                        </p>

                        {/* Audio Player */}
                        {endorsement.audioUrl && (
                          <div className="mt-2 rounded-lg bg-gray-50 p-2 sm:mt-3 sm:p-3">
                            <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                              <Mic className="h-3 w-3 text-[#40C3F3] sm:h-4 sm:w-4" />
                              <span className="text-xs font-medium sm:text-sm">
                                Voice Message
                              </span>
                            </div>
                            <audio
                              controls
                              src={endorsement.audioUrl}
                              className="h-6 w-full sm:h-8"
                            />
                          </div>
                        )}

                        {/* Files */}
                        {endorsement.files && endorsement.files.length > 0 && (
                          <div className="mt-3 sm:mt-4">
                            <button
                              onClick={() => setShowFiles(!showFiles)}
                              className="flex items-center gap-1 text-xs text-blue-500 sm:gap-2 sm:text-sm"
                            >
                              <Paperclip size={14} className="sm:size-16" />
                              View Attachments
                            </button>

                            {showFiles && (
                              <div className="mt-1 space-y-1 sm:mt-2 sm:space-y-2">
                                {endorsement.files?.map((file, index) => (
                                  <a
                                    key={index}
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 rounded-lg bg-white p-1 text-xs hover:bg-gray-50 sm:gap-2 sm:p-2 sm:text-sm"
                                  >
                                    <File
                                      size={14}
                                      className="text-blue-500 sm:size-16"
                                    />
                                    <span>Attachment {index + 1}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {activeEndorsementIndex === index && (
                    <button
                      onClick={() =>
                        openModal({
                          id: endorsement.id,
                          userName: endorsement.userName ?? "",
                          message: endorsement.message ?? "",
                          createdAt: endorsement.createdAt?.toISOString() ?? "",
                          files: endorsement.files ?? [],
                          userPhoto: endorsement.userPhoto ?? "",
                          audioUrl: endorsement.audioUrl ?? undefined,
                        })
                      }
                      className="relative right-2 flex items-center justify-center rounded-br-2xl rounded-tr-2xl bg-[#40C3F3] p-2 sm:right-3 sm:p-3 md:p-4"
                    >
                      <img
                        src="/assets/images/endorseye.png"
                        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                        alt="Eye Icon"
                      />
                    </button>
                  )}
                </div>
              ))}

              {(!endorsements || endorsements.length === 0) && (
                <div className="py-6 text-center text-sm text-gray-500 sm:py-8">
                  No Endorsements yet
                </div>
              )}
            </div>
          )}

          {/* Invite History */}
          <div
            className={`relative flex w-full items-center justify-between rounded-t-[45px] bg-[#F6F8FC] px-3 py-2 sm:px-4 ${showInviteHistory ? "bg-white" : ""}`}
          >
            <button className="rounded-full bg-white px-3 py-2 text-xs text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
              Invite History
            </button>

            <button
              onClick={() => setShowInviteHistory(!showInviteHistory)}
              className="rounded-full bg-white p-1 sm:p-2"
            >
              <ArrowUpRight
                className={`h-4 w-4 transition-transform duration-300 sm:h-5 sm:w-5 ${showInviteHistory ? "rotate-90" : "rotate-0"}`}
              />
            </button>
          </div>

          {showInviteHistory && (
            <div className="flex max-h-[250px] flex-col gap-3 overflow-y-auto bg-white p-3 sm:max-h-[300px] sm:gap-4 sm:p-4">
              {inviteHistory?.map((invite) => (
                <Card key={invite.id} className="w-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <img
                        src={
                          invite.individualPhoto ?? "/assets/images/profile.png"
                        }
                        alt="user photo"
                        className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 object-cover sm:h-10 sm:w-10 md:h-12 md:w-12"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-xs text-gray-500 sm:mb-4 sm:text-sm">
                          Invite sent to{" "}
                          <strong>{invite.email ?? invite.phoneNumber}</strong>{" "}
                          as role of <strong>{invite.role}</strong>
                        </p>

                        <span className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
                          <CalendarClockIcon className="h-3 w-3 text-[#40C3F3] sm:h-4 sm:w-4" />
                          {invite.updatedAt?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      <ViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        endorsement={selectedEndorsement}
      />
    </div>
  );
};

export default HomeContent;
