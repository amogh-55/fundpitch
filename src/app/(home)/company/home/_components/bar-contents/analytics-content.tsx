"use client";
import React, { Fragment } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Download } from "lucide-react";

const data = [
  { name: "November 01", value: 50000 },
  { name: "November 05", value: 40000 },
  { name: "November 06", value: 50000 },
  { name: "November 15", value: 45000 },
  { name: "November 20", value: 35000 },
  { name: "November 25", value: 30000 },
  { name: "November 30", value: 25000 },
  { name: "November 35", value: 35000 },
  { name: "November 40", value: 40000 },
  { name: "November 45", value: 50000 },
];

const formatYAxis = (tick: number) => {
  if (tick >= 1000 && tick < 10000) return `${tick / 1000}K`;
  if (tick >= 10000) return `${tick / 1000}K`;
  return tick.toString();
};

const AnalyticsContent = () => {
  return (
    <Fragment>
      <div className="bg-primaryBlue mt-6 rounded-t-[45px] p-6 pb-12 shadow-lg">
        <h2 className="relative bottom-1 ml-8 text-lg font-medium text-white">
          Analytics
        </h2>
      </div>
      <div className="relative bottom-10 w-full rounded-t-[45px] bg-white p-16 pr-0">
        <span className="flex flex-row justify-between px-16 pb-10">
          <h3 className="mb-4 text-lg font-semibold text-gray-600">Overview</h3>

          <span className="flex flex-row gap-8">
            <button className="rounded-md bg-[#F5F6F7] p-3">
              <Download />
            </button>

            <select className="rounded-md bg-[#F5F6F7] p-3">
              <option value="This month"> This Month</option>
              <option value="This week"> This Week</option>
              <option value="This year"> This Year</option>
            </select>
          </span>
        </span>

        <ResponsiveContainer width="100%" height={300} className="p-2">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#40C3F3" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#E5E7E8" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={formatYAxis}
              ticks={[0, 3000, 20000, 35000, 50000, 60000]}
              tick={{ fill: "#6B7280" }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#40C3F3"
              strokeWidth={6}
              fillOpacity={1}
              fill="url(#fillColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  );
};

export default AnalyticsContent;
