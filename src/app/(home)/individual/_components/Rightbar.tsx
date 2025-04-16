"use client";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2Icon,
  CalendarDays,
  Eye,
  Paperclip,
  File,
  Mic,
} from "lucide-react";
import React, { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Invite {
  id: string;
  company: string;
  message: string;
  individualPhoto: string | null;
  companyId: string;
  date: string;
  logo: string;
  status: string;
}

interface Expression {
  id: string;
  companyName: string;
  companyLogo: string | null;
  expressType: string;
  expressMessage: string;
  isApproved: boolean;
  createdAt: Date;
}

interface Endorsement {
  id: string;
  companyName: string;
  companyLogo: string | null;

  endorseMessage: string;
  isApproved: boolean;
  createdAt: Date;
  audioFile: string | null;
  files: string[] | null;
}

const InviteItem = React.memo(
  ({
    invite,
    isActive,
    onToggle,
  }: {
    invite: Invite;
    isActive: boolean;
    onToggle: (id: string) => void;
  }) => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="flex flex-row"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          onClick={() => onToggle(invite.id)}
          className="relative z-10 flex w-full cursor-pointer items-center rounded-xl bg-[#f6f8fc] p-4 shadow-sm"
        >
          <img
            src={invite.individualPhoto ?? "/assets/images/profile.png"}
            alt={""}
            className="mr-4 h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-gray-600">
              {invite.message}
              {invite.status === "sent" && (
                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  Sent
                </span>
              )}
            </p>
            <p className="mt-1 flex flex-row items-center gap-3 text-xs text-[#6C757D]">
              <CalendarDays size={16} className="rounded-md text-[#40C3F3]" />
              {invite.date}
            </p>
          </div>
        </div>
        {isHovered && (
          <button
            onClick={() => {
              router.push(`/company-overview?id=${invite.companyId}`);
            }}
            className="relative right-3 flex w-2/12 items-center justify-center rounded-br-xl rounded-tr-xl bg-[#40c3f3] p-4 transition-all duration-200"
          >
            <Eye size={20} className="text-white" />
          </button>
        )}
      </div>
    );
  },
);

InviteItem.displayName = "InviteItem";

// New Endorsement Item Component
const EndorsementItem = React.memo(
  ({ endorsement }: { endorsement: Endorsement }) => {
    const [showFiles, setShowFiles] = useState(false);
    const hasFiles = endorsement.files && endorsement.files.length > 0;

    return (
      <div className="mb-4 mt-6 flex flex-col rounded-lg bg-[#F6F8FC] p-4 shadow-sm">
        <div className="flex items-center">
          <img
            src={endorsement.companyLogo ?? "/assets/images/profile.png"}
            alt="Company Logo"
            className="mr-4 h-12 w-12 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              You endorsed{" "}
              <span className="font-bold">{endorsement.companyName}</span>
            </p>
            {/* {!endorsement.isApproved && (
              <span className="text-xs text-red-500">
                This endorsement is not yet approved by{" "}
                {endorsement.companyName}
              </span>
            )} */}
            <p className="mt-2 text-sm text-gray-600">
              {endorsement.endorseMessage}
            </p>
            <p className="mt-1 flex flex-row items-center gap-3 text-xs text-[#6C757D]">
              <CalendarDays size={16} className="rounded-md text-[#40C3F3]" />
              {format(endorsement.createdAt, "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        {endorsement.audioFile && (
          <div className="mt-4 rounded-lg bg-white p-3">
            <div className="flex items-center gap-2">
              <Mic size={16} className="text-blue-500" />
              <span className="text-sm font-medium">Voice Message</span>
            </div>
            <audio
              controls
              src={endorsement.audioFile}
              className="mt-2 w-full"
            />
          </div>
        )}

        {hasFiles && (
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
                    <span className="text-sm">Attachment {index + 1}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

EndorsementItem.displayName = "EndorsementItem";

// Modified Expression Item Component
const ExpressionItem = React.memo(
  ({ expression }: { expression: Expression }) => (
    <div className="mb-4 mt-6 flex items-center rounded-lg bg-[#F6F8FC] p-4 shadow-sm">
      <img
        src={expression.companyLogo ?? "/assets/images/profile.png"}
        alt="Company Logo"
        className="mr-4 h-12 w-12 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">
          You expressed an offer towards{" "}
          <span className="font-bold">{expression.companyName}</span>
        </p>
        {!expression.isApproved && (
          <span className="text-xs text-red-500">
            This expression is not yet approved by {expression.companyName}
          </span>
        )}
        <p className="mt-2 flex flex-row gap-2 text-xs font-normal text-gray-600">
          <BarChart2Icon
            size={18}
            className="rounded-md bg-[#4218ff13] p-1 text-[#4318FF]"
          />
          {expression.expressType}:{" "}
          <span className="font-medium">{expression.expressMessage}</span>
        </p>
        <p className="mt-1 flex flex-row gap-3 text-xs text-[#6C757D]">
          <CalendarDays size={16} className="rounded-md text-[#4318FF]" />
          {format(expression.createdAt, "MMM dd, yyyy")}
        </p>
      </div>
    </div>
  ),
);

ExpressionItem.displayName = "ExpressionItem";

const RightBar = () => {
  const [showExpression, setShowExpression] = useState(false);
  const [activeInviteId, setActiveInviteId] = useState<string | null>(null);
  const [showEndorsements, setShowEndorsements] = useState(false);

  const { data: invites, isLoading: invitesLoading } =
    api.individual.getInviteHistory.useQuery();
  const { data: expressions, isLoading: expressionsLoading } =
    api.individual.getExpressionHistory.useQuery();
  const { data: endorsements, isLoading: endorsementsLoading } =
    api.individual.getEndorsementHistory.useQuery();

  const toggleActiveIndex = (id: string) => {
    setActiveInviteId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="inset-shadow-2xs relative flex h-full flex-1 flex-col gap-2 rounded-t-[45px] border-t-2 border-[#40C3F3] bg-white lg:border-0">
      <button className="ml-5 mt-3 w-[123px] rounded-full bg-[#F6F8Fc] p-1.5 px-3 text-xs font-normal sm:p-2 sm:text-sm">
        Invite History
      </button>

      <div className="flex flex-col rounded-t-[45px] bg-white">
        {!showExpression && (
          <div className="mb-4 flex flex-col gap-4 overflow-y-auto rounded-t-[45px] bg-white px-3 py-4">
            {invites && invites.length > 0 ? (
              invites.map((invite) => (
                <InviteItem
                  key={invite.id}
                  invite={invite as Invite}
                  isActive={activeInviteId === invite.id}
                  onToggle={(id) =>
                    setActiveInviteId(id === activeInviteId ? null : id)
                  }
                />
              ))
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-gray-500">No invites found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expression and Endorsement History */}
      <div
        className={`relative flex flex-col items-center justify-between rounded-t-[45px] bg-[#F6F8FC] ${showExpression ? "absolute top-0 w-full" : "mt-auto"}`}
      >
        <div className="flex w-full flex-row items-center justify-between gap-2 p-2 px-5 pt-2">
          <div className="flex flex-row gap-2 sm:w-full sm:flex-nowrap sm:justify-around">
            {/* <button
              className={`rounded-full p-2 px-3 text-sm font-normal ${!showEndorsements ? "bg-white" : "bg-transparent"}`}
              onClick={() => setShowEndorsements(false)}
            >
              Expression History
            </button> */}
            <button
              className={`rounded-full p-2 text-sm font-normal sm:py-3 ${showEndorsements ? "bg-white" : "bg-transparent"}`}
              onClick={() => setShowEndorsements(true)}
            >
              Endorsement History
            </button>
          </div>
          <button
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 transition-transform duration-300 hover:bg-gray-300"
            onClick={() => setShowExpression((prev) => !prev)}
          >
            {showExpression ? (
              <ArrowDownRight size={18} />
            ) : (
              <ArrowUpRight size={18} />
            )}
          </button>
        </div>

        <div
          className={`w-full overflow-y-auto rounded-t-[45px] bg-white px-4 transition-all duration-300 ${
            showExpression ? "mt-4 max-h-72" : "max-h-0"
          }`}
        >
          {showEndorsements ? (
            endorsementsLoading ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-gray-500">Loading endorsements...</p>
              </div>
            ) : endorsements && endorsements.length > 0 ? (
              endorsements.map((endorsement) => (
                <EndorsementItem
                  key={endorsement.id}
                  endorsement={endorsement as Endorsement}
                />
              ))
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-gray-500">No endorsements found</p>
              </div>
            )
          ) : expressionsLoading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-gray-500">Loading expressions...</p>
            </div>
          ) : expressions && expressions.length > 0 ? (
            expressions.map((expression) => (
              <ExpressionItem
                key={expression.id}
                expression={expression as Expression}
              />
            ))
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-gray-500">No expressions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
