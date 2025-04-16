"use client";
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ArrowUpRight, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import { api } from "@/trpc/react";

interface Expression {
  id: string;
  expressType: string;
  expressMessage: string;
  isApproved: boolean;
  createdAt: Date;
  userName: string;
  userPhoto: string | null;
  location: string | null;
  role: string;
}

interface MonthlyStats {
  month: string;
  total: number;
  approved: number;
}

const OFFER_TYPES = [
  "Straight equity",
  "Convertible note",
  "Royalty deal",
  "Debt",
  "Debt + Equity mix",
  "Earnout deal",
  "Strategic partnership Offer",
  "Majority buyout",
  "Licensing deal",
] as const;

const FILTER_OPTIONS = ["All", "Pending", "Accepted"] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

const InvestorCard = ({ expression }: { expression: Expression }) => {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();
  const timeAgo = formatDistanceToNow(new Date(expression.createdAt), {
    addSuffix: true,
  });

  const acceptExpression = api.individual.acceptExpression.useMutation({
    onSuccess: () => {
      void utils.invalidate();
    },
  });

  const handleAccept = () => {
    acceptExpression.mutate({
      id: expression.id,
    });
  };

  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-gray-100 p-3 shadow-md sm:flex-row sm:items-center sm:gap-5 sm:p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <img
          src={expression.userPhoto ?? "/assets/images/profile.png"}
          alt={expression.userName}
          className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
        />
        <div className="truncate text-base font-semibold sm:text-lg">
          {expression.userName}
        </div>
        <div className="truncate text-xs text-gray-400 sm:text-sm">
          {expression.role}
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <div className="truncate text-sm sm:text-base">
            <span className="font-semibold">Type of Offer: </span>
            {expression.expressType}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 text-sm sm:text-base">
            <span className="font-semibold">Condition: </span>
            <p className="break-words">{expression.expressMessage}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col justify-between gap-2 text-xs text-gray-400 sm:mt-3 sm:flex-row sm:text-sm">
          <span className="flex min-w-0 flex-row items-center gap-1">
            <MapPin size={14} className="h-4 w-4" />
            <p className="truncate">{expression.location ?? "Unknown"}</p>
          </span>
          <span className="shrink-0">{timeAgo}</span>
        </div>
      </div>

      <div
        className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white shadow-md sm:right-5 sm:top-5 sm:h-10 sm:w-10"
        onClick={() => setIsOpen(true)}
      >
        <ArrowUpRight size={20} className="sm:size-28" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-4 shadow-xl sm:p-6 md:p-10">
            <button
              className="absolute right-2 top-2 text-gray-600 hover:text-gray-900 sm:right-3 sm:top-3"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <div className="mb-4 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-col items-center gap-2 sm:flex-row sm:items-start">
                <img
                  src={expression.userPhoto ?? "/assets/images/profile.png"}
                  alt={expression.userName}
                  className="h-16 w-16 shrink-0 rounded-full sm:h-20 sm:w-20"
                />
                <div className="min-w-0 text-center sm:text-left">
                  <h2 className="truncate text-lg font-semibold sm:text-xl">
                    {expression.userName}
                  </h2>
                  <p className="truncate text-gray-500">{expression.role}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-gray-700">
                <div className="truncate text-sm font-medium sm:text-base">
                  {expression.expressType}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm font-medium sm:text-base">Statement</div>
            </div>

            <p className="overflow-wrap-anywhere mb-4 break-words text-sm text-gray-600 sm:text-base">
              {expression.expressMessage}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500 sm:mb-6">
                <span className="truncate">
                  {format(new Date(expression.createdAt), "MMM d, yyyy")}
                </span>
              </div>

              <div className="flex shrink-0 justify-center gap-3 sm:justify-end sm:gap-4">
                <button
                  className="rounded-full bg-gray-400 px-4 py-1.5 text-sm text-white sm:px-5 sm:py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Ignore
                </button>
                <button
                  className="rounded-full bg-[#40C3F3] px-4 py-1.5 text-sm text-white sm:px-5 sm:py-2"
                  onClick={handleAccept}
                >
                  {acceptExpression.isPending ? "Accepting..." : "Accept"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ExpressionContent = () => {
  const [activeTab, setActiveTab] = useState<"Pending" | "Accepted">("Pending");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOfferType, setSelectedOfferType] = useState<
    "All" | (typeof OFFER_TYPES)[number]
  >("All");

  const { data, isLoading } = api.company.getCompanyExpressions.useQuery({
    offerType: selectedOfferType === "All" ? undefined : selectedOfferType,
    isApproved: activeTab === "Accepted",
  });

  const expressions = data?.expressions ?? [];
  const monthlyStats = data?.monthlyStats ?? [];

  return (
    <div>
      <div className="mt-6 rounded-t-[45px] bg-[#40C3F3] p-4 pb-8 shadow-lg sm:p-6 sm:pb-12">
        <h2 className="relative bottom-1 ml-4 text-base font-medium text-white sm:ml-8 sm:text-lg">
          Expression
        </h2>
      </div>

      <div className="relative bottom-8 flex w-full flex-col rounded-t-[45px] bg-white p-4 sm:bottom-10 sm:p-6 md:p-8 lg:flex-row lg:p-12 xl:p-16 xl:pr-0">
        <div className="mb-6 w-full lg:mb-0 lg:w-2/5">
          <div className="px-2 pb-4 sm:px-6 md:px-10 lg:px-16 lg:pb-10">
            <div className="relative w-full">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-md bg-[#F6F8FC] px-3 py-2 text-sm text-black sm:px-4 sm:py-3"
              >
                {selectedOfferType}{" "}
                {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>

              {isOpen && (
                <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md bg-[#F6F8FC] text-xs text-[#00000066] shadow-lg sm:max-h-60 sm:text-sm">
                  <div
                    onClick={() => {
                      setSelectedOfferType("All");
                      setIsOpen(false);
                    }}
                    className={`cursor-pointer px-3 py-2 hover:bg-[#40C3F3] hover:text-white sm:px-4 sm:py-3 ${
                      selectedOfferType === "All"
                        ? "bg-[#40C3F3] font-semibold text-white"
                        : ""
                    }`}
                  >
                    All
                  </div>
                  {OFFER_TYPES.map((type) => (
                    <div
                      key={type}
                      onClick={() => {
                        setSelectedOfferType(type);
                        setIsOpen(false);
                      }}
                      className={`cursor-pointer px-3 py-2 hover:bg-[#40C3F3] hover:text-white sm:px-4 sm:py-3 ${
                        selectedOfferType === type
                          ? "bg-[#40C3F3] font-semibold text-white"
                          : ""
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="m-2 sm:m-4">
              <div className="text-xs text-[#A8A6AB] sm:text-sm">
                Activity history
              </div>
              <div className="mt-1 text-base sm:mt-2 sm:text-lg">
                Total Expressions: {expressions.length}
              </div>
            </div>
          </div>

          <div className="h-40 w-full sm:h-52 md:h-64 lg:h-52 lg:w-[70%] xl:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#333" }} fontSize={12} />
                <YAxis tick={{ fill: "#333" }} fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  name="Total Expressions"
                  dataKey="total"
                  stroke="#2f72ff"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  name="Approved"
                  dataKey="approved"
                  stroke="#40C3F3"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full lg:w-[55%]">
          {/* Status Tabs */}
          <div className="flex gap-8 border-b-2 sm:gap-12 md:gap-16 lg:gap-20">
            <div
              className={`cursor-pointer p-2 text-sm sm:text-base ${
                activeTab === "Pending"
                  ? "border-b-4 border-[#40C3F3] font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Pending")}
            >
              Pending
            </div>
            <div
              className={`cursor-pointer p-2 text-sm sm:text-base ${
                activeTab === "Accepted"
                  ? "border-b-4 border-[#40C3F3] font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Accepted")}
            >
              Accepted
            </div>
          </div>

          <div className="pt-4">
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center sm:h-40">
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : expressions.length > 0 ? (
                expressions.map((expression) => (
                  <InvestorCard
                    key={expression.id}
                    expression={expression as Expression}
                  />
                ))
              ) : (
                <div className="p-4 text-base text-gray-500 sm:text-lg">
                  No {activeTab.toLowerCase()} expressions found
                  {selectedOfferType !== "All"
                    ? ` for ${selectedOfferType}`
                    : ""}
                  .
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpressionContent;
