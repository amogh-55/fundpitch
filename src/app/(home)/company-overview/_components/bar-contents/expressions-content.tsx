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
  const timeAgo = formatDistanceToNow(new Date(expression.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="relative flex items-center gap-5 rounded-3xl bg-gray-100 p-6 shadow-md">
      <div className="flex flex-col gap-3">
        <img
          src={expression.userPhoto ?? "/assets/images/profile.png"}
          alt={expression.userName}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="text-lg font-semibold">{expression.userName}</div>
        <div className="text-sm text-gray-400">{expression.role}</div>

        <div className="flex items-center gap-2">
          <img
            src="/assets/images/Button.png"
            alt="Offer Icon"
            className="h-5 w-5"
          />
          <div>
            <span className="font-semibold">Type of Offer: </span>
            {expression.expressType}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <img
            src="/assets/images/Button.png"
            alt="Condition Icon"
            className="h-5 w-5"
          />
          <div>
            <span className="font-semibold">Condition: </span>
            {expression.expressMessage}
          </div>
        </div>

        <div className="mt-3 flex justify-between text-sm text-gray-400">
          <span className="flex flex-row items-center justify-center">
            <MapPin size={16} />
            <p>{expression.location ?? "Unknown"}</p>
          </span>
          <span>{timeAgo}</span>
        </div>
      </div>

      <div
        className="absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <ArrowUpRight size={28} />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white p-10 shadow-xl">
            <button
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <div className="mb-6 flex items-center justify-between">
              <div className="">
                <img
                  src={expression.userPhoto ?? "/assets/images/profile.png"}
                  alt={expression.userName}
                  className="h-20 w-20 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {expression.userName}
                  </h2>
                  <p className="text-gray-500">{expression.role}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-gray-700">
                <img
                  src="/assets/images/royaldeal.png"
                  alt=""
                  className="h-20 w-20"
                />
                <div className="font-medium">{expression.expressType}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/images/Button.png" alt="" />
              <div>Statement</div>
            </div>

            <p className="mb-4 text-gray-600">{expression.expressMessage}</p>
            <div className="mt-16 flex items-center justify-between">
              <div className="mb-6 flex items-center gap-2 text-gray-500">
                <img src="/assets/images/calender.png " alt="" />{" "}
                <span>
                  {format(new Date(expression.createdAt), "MMM d, yyyy")}
                </span>
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
      <div className="mt-6 rounded-t-[45px] bg-[#40C3F3] p-6 pb-12 shadow-lg">
        <h2 className="relative bottom-1 ml-8 text-lg font-medium text-white">
          Expression
        </h2>
      </div>

      <div className="gap-42 relative bottom-10 flex w-full flex-row rounded-t-[45px] bg-white p-16 pr-0">
        <div className="w-2/5">
          <div className="px-16 pb-10">
            <div className="relative w-full">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-md bg-[#F6F8FC] px-4 py-3 text-black"
              >
                {selectedOfferType}{" "}
                {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>

              {isOpen && (
                <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md bg-[#F6F8FC] text-[#00000066] shadow-lg">
                  <div
                    onClick={() => {
                      setSelectedOfferType("All");
                      setIsOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-3 hover:bg-[#40C3F3] hover:text-white ${
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
                      className={`cursor-pointer px-4 py-3 hover:bg-[#40C3F3] hover:text-white ${
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

            <div className="m-4">
              <div className="text-sm text-[#A8A6AB]">Activity history</div>
              <div className="mt-2 text-lg">
                Total Expressions: {expressions.length}
              </div>
            </div>
          </div>

          <ResponsiveContainer width="70%" height={250}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#333" }} />
              <YAxis tick={{ fill: "#333" }} />
              <Tooltip />
              <Line
                type="monotone"
                name="Total Expressions"
                dataKey="total"
                stroke="#2f72ff"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                name="Approved"
                dataKey="approved"
                stroke="#40C3F3"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="w-[55%]">
          {/* Status Tabs */}
          <div className="flex gap-20 border-b-2">
            <div
              className={`cursor-pointer p-2 ${
                activeTab === "Pending"
                  ? "border-b-4 border-[#40C3F3] font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("Pending")}
            >
              Pending
            </div>
            <div
              className={`cursor-pointer p-2 ${
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
                <div className="flex h-40 items-center justify-center">
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
                <div className="p-4 text-lg text-gray-500">
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
