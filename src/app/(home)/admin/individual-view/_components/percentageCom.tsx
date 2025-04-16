"use client";

import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
import { User2, User } from "lucide-react";

interface percentagebar {
    percentage: number;
}

const PercentageComponent = ({ percentage }: percentagebar) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setTimeout(() => setProgress(percentage), 200); // Delay for smooth animation
    }, [percentage]);

    const circleRadius = 26; // Further Increased Radius
    const circleCircumference = 2 * Math.PI * circleRadius; // Total Circle Length

    const strokeDashoffset =
        circleCircumference - (progress / 100) * circleCircumference;

    return (
        <div className="flex h-32 w-56 flex-col rounded-2xl bg-white text-center shadow-lg shadow-[#3a4ee91c]">
            {" "}
            {/* Increased Width */}
            <div className="flex flex-row items-center justify-center gap-2">
                <div className="relative h-24 w-20">
                    {" "}
                    {/* Increased Circle Size */}
                    {/* SVG Circle Progress with One Circle */}
                    <svg
                        className="h-full w-full"
                        style={{ transform: "rotate(-90deg)" }}
                    >
                        {" "}
                        {/* Rotate Circle to Opposite Side */}
                        <circle
                            cx="50%"
                            cy="50%"
                            r={circleRadius}
                            stroke="#E9ECF1"
                            strokeWidth="6" // Thicker Background Circle Stroke
                            fill="transparent"
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r={circleRadius}
                            stroke="#40C3F3"
                            strokeWidth="4" // Thicker Progress Circle Stroke
                            fill="transparent"
                            strokeDasharray={circleCircumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{
                                transition: "stroke-dashoffset 2s ease-in-out",
                            }}
                        />
                    </svg>
                    {/* Icon in Center with Background and Padding */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img src="/assets/images/user.png" alt="User" className="h-4 w-4" />{" "}
                        {/* Image Icon */}
                    </div>
                </div>

                <span className="flex flex-col items-start">
                    <h2 className="text-xl font-bold">{progress}%</h2>{" "}
                    {/* Bigger Percentage Text */}
                    <p className="mt-1 text-xs text-gray-400">Complete the profile</p>
                </span>
            </div>
            <hr className="mx-4 border-t border-gray-300" />
        </div>
    );
};

export default PercentageComponent;