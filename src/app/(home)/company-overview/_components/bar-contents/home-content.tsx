"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mic, Paperclip, User } from "lucide-react";
import { api } from "@/trpc/react";
import NotFound from "../not-found";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Dot,
  ChevronDown,
  CalendarClockIcon,
  File,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ViewModal from "../ViewModal";
import { formatDistanceToNow } from "date-fns";
import { type Endorsement } from "../ViewModal";

const HomeContent = ({ id }: { id: string }) => {
  const [showRequest, setShowRequest] = useState(false);
  const [isInviteTrue, setIsInviteTrue] = useState(false);
  const { data: homeDetails } = api.overViewProfile.getHomeDetails.useQuery({
    id,
  });

  const { data: inviteHistory } = api.overViewProfile.getInviteHistory.useQuery(
    {
      id,
    },
  );

  const { data: endorsements } =
    api.overViewProfile.getCompanyEndorsements.useQuery({
      id,
    });

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
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    console.log(endorsements);
  }, [endorsements]);

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

  console.log({ endorsements: endorsements });

  console.log({ homeDetails: homeDetails?.about });
  if (!id) return <NotFound />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[70%_30%]">
      <Card className="relative rounded-t-[46px] bg-white">
        <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4">
          <h2 className="relative bottom-5 left-10 flex font-normal text-white">
            Company Overview
          </h2>
        </div>
        <div className="absolute top-14 w-full rounded-t-[45px] bg-white p-14 pt-8">
          <p className="text-sm text-black md:text-base">
            {homeDetails?.about}
          </p>
        </div>
      </Card>

      <Card className="relative rounded-t-[46px] bg-[#F6F8FC]">
        <button className="m-4 mb-3 rounded-full bg-white px-4 py-3 text-sm text-gray-700">
          Endorsement
        </button>

        <div className="rounded-t-[45px] bg-white">
          {!showInviteHistory && (
            <div className="mb-2 flex max-h-[300px] flex-col gap-4 overflow-y-auto p-6">
              {endorsements?.map((endorsement, index) => (
                <div
                  key={endorsement.id}
                  className="relative flex cursor-pointer flex-row"
                >
                  <div
                    className={`relative cursor-pointer rounded-2xl bg-gray-100 p-4 shadow-sm transition-shadow hover:shadow-md ${activeEndorsementIndex === index ? "w-10/12" : "w-full"}`}
                    onClick={() =>
                      setActiveEndorsementIndex(
                        activeEndorsementIndex === index ? null : index,
                      )
                    }
                  >
                    <div className="flex items-start gap-3">
                      {/* User Photo */}
                      <div className="relative">
                        <img
                          src={
                            endorsement.userPhoto ??
                            "/assets/images/profile.png"
                          }
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
                        <p className="mt-1 text-gray-600">
                          {endorsement.message}
                        </p>

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
                      className="relative right-3 flex items-center justify-center rounded-br-2xl rounded-tr-2xl bg-[#40C3F3] p-4"
                    >
                      <img
                        src="/assets/images/endorseye.png"
                        className="h-6 w-6"
                        alt="Eye Icon"
                      />
                    </button>
                  )}
                </div>
              ))}

              {(!endorsements || endorsements.length === 0) && (
                <div className="py-8 text-center text-gray-500">
                  No Endorsements yet
                </div>
              )}
            </div>
          )}

          {/* Invite History */}
          <div
            className={`relative flex w-full items-center justify-between rounded-t-[45px] bg-[#F6F8FC] px-4 py-2 ${showInviteHistory ? "bg-white" : ""}`}
          >
            <button className="rounded-full bg-white px-4 py-3 text-sm text-gray-700">
              Invite History
            </button>

            <button
              onClick={() => setShowInviteHistory(!showInviteHistory)}
              className="rounded-full bg-white p-2"
            >
              <ArrowUpRight
                className={`transition-transform duration-300 ${showInviteHistory ? "rotate-90" : "rotate-0"}`}
              />
            </button>
          </div>

          {showInviteHistory && (
            <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto bg-white p-4">
              {inviteHistory?.map((invite) => (
                <Card key={invite.id} className="w-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          invite.companyPhoto ?? "/assets/images/profile.png"
                        }
                        alt="Company Logo"
                        className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-medium">
                            {invite.companyName}
                          </p>
                        </div>

                        <p className="mb-4 text-sm text-gray-500">
                          Invite sent to{" "}
                          <strong>{invite.email ?? invite.phoneNumber}</strong>{" "}
                          as role of <strong>{invite.role}</strong>
                        </p>

                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <CalendarClockIcon className="h-4 w-4 text-[#40C3F3]" />
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
