"use client";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2Icon,
  CalendarDays,
} from "lucide-react";
import React, { useState } from "react";

// Static Data (Outside Component to Prevent Unnecessary Renders)
const invites = [
  {
    id: 1,
    company: "EQUIPPP 3.0 LABS",
    message: "has invited you as an Investor into their network",
    date: "25th February 2025",
    logo: "/assets/images/tcs.png",
  },
  {
    id: 2,
    company: "EQUIPPP 3.0 LABS",
    message: "has invited you as an Investor into their network",
    date: "25th February 2025",
    logo: "/assets/images/tcs.png",
  },
];

const expressions = [
  {
    id: 1,
    company: "XCompany",
    logo: "/assets/images/tcs.png",
    offer: "I’ll buy 20% stake for 200 cr",
    date: "25th February 2025",
  },
  {
    id: 2,
    company: "XCompany",
    logo: "/assets/images/tcs.png",
    offer: "I’ll buy 20% stake for 200 cr",
    date: "25th February 2025",
  },
  {
    id: 3,
    company: "XCompany",
    logo: "/assets/images/tcs.png",
    offer: "I’ll buy 20% stake for 200 cr",
    date: "25th February 2025",
  },
  {
    id: 4,
    company: "XCompany",
    logo: "/assets/images/tcs.png",
    offer: "I’ll buy 20% stake for 200 cr",
    date: "25th February 2025",
  },
];

// Reusable Invite Item Component (Optimized)
const InviteItem = React.memo(
  ({
    invite,
    isActive,
    onToggle,
  }: {
    invite: {
      id: number;
      company: string;
      message: string;
      date: string;
      logo: string;
    };
    isActive: boolean;
    onToggle: (id: number) => void;
  }) => (
    <div className="flex flex-row">
      <div
        onClick={() => onToggle(invite.id)}
        className="relative z-10 flex w-full cursor-pointer items-center rounded-xl bg-[#f6f8fc] p-4 shadow-sm"
      >
        <img
          src={invite.logo}
          alt="Company Logo"
          className="mr-4 h-12 w-12 rounded-full"
        />
        <div>
          <p className="text-sm font-medium">{invite.company}</p>
          <p className="text-xs text-gray-600">{invite.message}</p>
          <p className="mt-1 flex flex-row gap-3 text-xs text-[#6C757D]">
            <CalendarDays size={16} className="rounded-md text-[#40C3F3]" />{" "}
            {invite.date}
          </p>
        </div>
      </div>
      {isActive && (
        <button className="relative right-3 flex w-2/12 items-center justify-center rounded-br-xl rounded-tr-xl bg-[#40c3f3] p-4">
          <img
            src="/assets/images/endorseye.png"
            alt="View"
            className="h-6 w-10"
          />
        </button>
      )}
    </div>
  ),
);

InviteItem.displayName = "InviteItem";

// Reusable Expression Item Component (Optimized)
const ExpressionItem = React.memo(
  ({
    expression,
  }: {
    expression: {
      id: number;
      company: string;
      logo: string;
      offer: string;
      date: string;
    };
  }) => (
    <div className="mb-4 mt-6 flex items-center rounded-lg bg-[#F6F8FC] p-4 shadow-sm">
      <img
        src={expression.logo}
        alt="Company Logo"
        className="mr-4 h-12 w-12 rounded-full"
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">
          You expressed an offer towards{" "}
          <span className="font-bold">{expression.company}</span>
        </p>
        <p className="mt-2 flex flex-row gap-2 text-xs font-normal text-gray-600">
          <BarChart2Icon
            size={18}
            className="rounded-md bg-[#4218ff13] p-1 text-[#4318FF]"
          />{" "}
          Offer: <span className="font-medium">{expression.offer}</span>
        </p>
        <p className="mt-1 flex flex-row gap-3 text-xs text-[#6C757D]">
          <CalendarDays size={16} className="rounded-md text-[#4318FF]" />{" "}
          {expression.date}
        </p>
      </div>
    </div>
  ),
);

ExpressionItem.displayName = "ExpressionItem";

const RightBar = () => {
  const [showExpression, setShowExpression] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleActiveIndex = (id: number) => {
    setActiveIndex((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative flex h-full flex-1 flex-col gap-2 rounded-t-[45px] bg-white shadow-lg">
      {/* Invite History */}
      <button className="ml-5 mt-2 w-1/3 rounded-full bg-[#F6F8Fc] p-2 text-sm font-normal">
        Invite History
      </button>

      {/* Invite List */}
      <div className="flex flex-col rounded-t-[45px] bg-white">
        {!showExpression && (
          <div className="mb-4 flex flex-col gap-4 overflow-y-auto rounded-t-[45px] bg-white px-3 py-4">
            {invites.map((invite) => (
              <InviteItem
                key={invite.id}
                invite={invite}
                isActive={activeIndex === invite.id}
                onToggle={toggleActiveIndex}
              />
            ))}
          </div>
        )}
      </div>

      {/* Expression History */}
      {/* <div
        className={`relative flex flex-col items-center justify-between rounded-t-[45px] bg-[#F6F8FC] ${showExpression ? "absolute top-0 w-full" : "mt-auto"}`}
      >
        <div className="flex w-full flex-row justify-between p-2 px-5 pt-2">
          <button className="ml-4 rounded-full bg-white p-2 px-3 text-sm font-normal">
            Expression History
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 transition-transform duration-300"
            onClick={() => setShowExpression((prev) => !prev)}
          >
            {showExpression ? <ArrowDownRight /> : <ArrowUpRight />}
          </button>
        </div>

        <div
          className={`overflow-y-auto rounded-t-[45px] bg-white px-4 transition-all duration-300 ${
            showExpression ? "mt-4 max-h-72" : "max-h-0"
          }`}
          style={{ minHeight: showExpression ? "auto" : "0px" }}
        >
          {expressions.map((expression) => (
            <ExpressionItem key={expression.id} expression={expression} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default RightBar;
