"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const userTypes = [
  {
    name: "Company Founder",
    type: "company-founder",
    image: "/assets/images/founder.png",
  },
  {
    name: "Merchant Banker",
    type: "merchant-banker",
    image: "/assets/images/banker.png",
  },
  {
    name: "Investors",
    type: "investors",
    image: "/assets/images/investor.png",
  },
  {
    name: "Advisor / SME",
    type: "advisor/SME",
    image: "/assets/images/advisor.png",
  },
  {
    name: "Service Provider",
    type: "service-provider",
    image: "/assets/images/service.png",
  },
  {
    name: "Consultant / Facilitator",
    type: "consultant/facilitator",
    image: "/assets/images/consult.png",
  },
  // {
  //   name: "Product / Service Clients",
  //   type: "product&service",
  //   image: "/assets/images/productservice.png",
  // },
  { name: "Others", type: "others", image: "/assets/images/others.png" },
];

const UserType = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [currentGif, setCurrentGif] = useState("/assets/images/gif1.gif");

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGif("/assets/images/gif2.gif");
      setTimeout(() => {
        setCurrentGif("/assets/images/gif1.gif");
      }, 2000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setSelectedIndex(
      (prev) => (prev - 1 + userTypes.length) % userTypes.length,
    );
  };

  const handleNext = () => {
    setDirection(1);
    setSelectedIndex((prev) => (prev + 1) % userTypes.length);
  };

  const handleContinue = () => {
    const userType = userTypes[selectedIndex]?.type;
    if (userType) {
      router.push(`/signup?userType=${userType}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[url('/assets/images/login-bg.png')] bg-cover bg-center px-4 sm:px-8">
      <span className="flex w-full flex-row justify-between py-8 text-sm sm:text-base">
        <Link href="/" className="flex flex-row text-lg font-bold sm:text-xl">
          Fund<p className="text-[#2595BE]">Pitch</p>
        </Link>
        <span className="flex flex-row items-center justify-center gap-2">
          <p className="text-xs sm:text-base">Existing User?</p>
          <button
            onClick={() => router.push("/login")}
            className="flex flex-row items-center gap-2 rounded-lg p-1 px-2 text-xs text-blue-500 hover:bg-blue-100 sm:text-sm"
          >
            <p>Login</p>
            <ArrowRight size={18} />
          </button>
        </span>
      </span>

      {/* Main Content */}
      <div className="mt-10 flex w-full max-w-4xl flex-col items-center justify-center gap-28 sm:mt-20 sm:flex-row">
        {/* Left Side - GIF */}
        <div className="flex h-80 w-full justify-center sm:w-1/2 sm:justify-start">
          <img
            src={currentGif}
            alt="Animated Graphic"
            className="sm:w-100 h-90 sm:h-100 ml-2 w-full object-cover"
          />
        </div>

        {/* Right Side - Selection Box */}
        <div className="flex w-full flex-shrink-0 flex-col items-center justify-center sm:w-1/2">
          <h2 className="mb-6 text-lg text-gray-700">Select User Type</h2>
          <div className="relative flex h-60 w-full max-w-lg items-center justify-center sm:h-72">
            <button
              onClick={handlePrev}
              className="absolute left-0 z-10 p-2 text-[#0085FF] hover:text-gray-900"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="relative flex w-full items-center justify-center overflow-hidden">
              {/* Left (Previous) */}
              <div className="absolute left-5 flex h-48 w-40 scale-90 flex-col items-center justify-center gap-5 rounded-2xl bg-blue-400 text-center text-white opacity-50 shadow-md sm:left-10 sm:h-52 sm:w-48">
                <img
                  src={
                    userTypes[
                      (selectedIndex - 1 + userTypes.length) % userTypes.length
                    ]?.image ?? ""
                  }
                  alt={
                    userTypes[
                      (selectedIndex - 1 + userTypes.length) % userTypes.length
                    ]?.name ?? "User Type"
                  }
                  className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                />
                <span className="text-sm font-normal sm:text-lg">
                  {
                    userTypes[
                      (selectedIndex - 1 + userTypes.length) % userTypes.length
                    ]?.name
                  }
                </span>
              </div>
              {/* Center (Current) */}
              <div className="relative z-20 flex h-48 w-2/3 flex-col items-center justify-center gap-5 rounded-2xl bg-[#0085FF] p-4 text-center text-white shadow-md sm:h-60 sm:w-1/2 sm:p-6">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 100 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-20 flex flex-col items-center justify-center gap-5"
                >
                  <img
                    src={userTypes[selectedIndex]?.image ?? ""}
                    alt={userTypes[selectedIndex]?.name ?? "User Type"}
                    className="mb-2 h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                  />
                  <span className="text-sm font-normal sm:text-lg">
                    {userTypes[selectedIndex]?.name}
                  </span>
                </motion.div>
              </div>
              {/* Right (Next) */}
              <div className="absolute right-5 flex h-48 w-40 scale-90 flex-col items-center justify-center gap-5 rounded-2xl bg-[#0084ffcf] text-center text-white opacity-50 shadow-md sm:right-10 sm:h-52 sm:w-48">
                <img
                  src={
                    userTypes[(selectedIndex + 1) % userTypes.length]?.image ??
                    ""
                  }
                  alt={
                    userTypes[(selectedIndex + 1) % userTypes.length]?.name ??
                    "User Type"
                  }
                  className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                />
                <span className="text-sm font-normal sm:text-lg">
                  {userTypes[(selectedIndex + 1) % userTypes.length]?.name}
                </span>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="absolute right-0 z-10 p-2 text-[#0085FF] hover:text-gray-900"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <button
            onClick={handleContinue}
            className="mt-10 rounded-full bg-[#0085FF] px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserType;
