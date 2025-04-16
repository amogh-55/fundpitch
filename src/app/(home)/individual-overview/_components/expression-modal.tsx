"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";

interface ExpressionModalProps {
  show: boolean;
  onClose: () => void;
}

type OfferType =
  | "Straight equity"
  | "Convertible note"
  | "Royalty deal"
  | "Debt"
  | "Debt + Equity mix"
  | "Earnout deal"
  | "Strategic partnership Offer"
  | "Majority buyout"
  | "Licensing deal"
  | "Select type of offer";

const offerDetails = {
  "Straight equity": {
    icon: "/assets/images/equity 1.png",
    description:
      "Investor offers money in exchange for a percentage of the company.",
    example: "₹1 crore for 10% equity (Company valued at ₹10 crore).",
  },
  "Convertible note": {
    icon: "/assets/images/note 1.png",
    description:
      "An investor gives a loan that converts into equity later at a discount.",
    example:
      "₹50 lakh loan, convertible into equity at a 20% discount when the company raises a Series A round.",
  },
  "Royalty deal": {
    icon: "/assets/images/agreement 1.png",
    description:
      "Investor gets a percentage of revenue until a certain amount is paid.",
    example: "5% of sales until ₹2 crore is repaid.",
  },
  Debt: {
    icon: "/assets/images/debt 1.png",
    description:
      "Investor provides a loan that must be repaid with interest, regardless of the company's performance.",
    example: "₹1 crore loan at 12% annual interest, repayable over 5 years.",
  },
  "Debt + Equity mix": {
    icon: "/assets/images/equity (1) 1.png",
    description: "A combination of a loan and ownership stake.",
    example: "₹1 crore as a loan at 10% interest + 5% equity in the company.",
  },
  "Earnout deal": {
    icon: "/assets/images/Group 1171275827.png",
    description: "Part of the payment is based on future performance.",
    example:
      "₹1 crore upfront + ₹2 crore if revenue reaches ₹10 crore in 2 years.",
  },
  "Strategic partnership Offer": {
    icon: "/assets/images/startegic.png",
    description:
      "Instead of just investing, the investor provides strategic support.",
    example:
      "₹1 crore for 15% equity and introductions to my distribution network.",
  },
  "Majority buyout": {
    icon: "/assets/images/deal.png",
    description: "The investor buys more than 50% and takes control.",
    example: "I'll buy 60% of your company for ₹5 crore and you keep 40%.",
  },
  "Licensing deal": {
    icon: "/assets/images/license.png",
    description: "Investor helps a company expand using their brand name.",
    example:
      "I'll invest ₹2 crore, and you will use my brand to sell your products.",
  },
} as const;

const ExpressionModal = ({ show, onClose }: ExpressionModalProps) => {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("id");
  const { toast } = useToast();

  const addExpression = api.individual.addExpression.useMutation({
    onSuccess: () => {
      toast({
        title: "Expression sent successfully!",
      });
      onClose();
      setSelectedOffer("Select type of offer");
      setInputText("");
    },
    onError: (error) => {
      toast({
        title: "Failed to send expression",
        description: error.message,
      });
    },
  });

  const [selectedOffer, setSelectedOffer] = useState<OfferType>(
    "Select type of offer",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [inputtext, setInputText] = useState("");

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  const handleSendExpression = () => {
    if (!companyId) {
      toast({
        title: "Company ID is missing",
      });
      return;
    }

    if (selectedOffer === "Select type of offer") {
      toast({
        title: "Please select an offer type",
      });
      return;
    }

    if (!inputtext.trim()) {
      toast({
        title: "Please enter your expression message",
      });
      return;
    }

    addExpression.mutate({
      companyUserId: companyId,
      expressType: selectedOffer,
      expressMessage: inputtext,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`relative flex h-3/4 w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white md:flex-row ${showReviewModal ? "h-2/5" : ""}`}
      >
        {showReviewModal ? (
          <>
            <div className="flex w-full flex-col rounded-lg">
              <button
                className="relative flex w-full flex-row items-center justify-start gap-2 rounded-t-lg bg-[#40C3F3] p-4 text-white"
                onClick={() => setShowReviewModal(false)}
              >
                <ArrowLeft size={16} />
                <p className="text-sm">Go Back</p>
              </button>

              <div className="flex flex-row gap-6 p-6 px-12">
                <span className="flex flex-shrink-0">
                  <img
                    src="/assets/images/endorseuser.png"
                    alt=""
                    className="h-24 w-24"
                  />
                </span>

                <span className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Individual user x</p>

                  <p>{selectedOffer}</p>
                  <p>
                    {selectedOffer !== "Select type of offer" &&
                      offerDetails[selectedOffer].description}
                  </p>
                  <p className="text-sm font-medium text-[#6C757D]">
                    {selectedOffer !== "Select type of offer" &&
                      offerDetails[selectedOffer].example}
                  </p>
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Left Side Illustration */}
            <div className="relative flex items-center justify-center md:w-1/2">
              <img
                src="/assets/images/Modalbg2.png"
                alt="Clouds"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right Side Content */}
            <div className="flex min-h-[400px] flex-col gap-3 p-4 md:w-1/2 md:p-6">
              <button
                className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <X />
              </button>
              <h2 className="text-Poppins mb-2 text-lg font-medium leading-tight">
                Start your Journey with a Worthy Expression
              </h2>
              <p className="mb-4 text-sm font-normal leading-[1.2] text-gray-500">
                Got an offer to make a connection with the company? Write it
                down here and take the first step towards building something
                impactful.
              </p>

              {/* Custom Dropdown */}
              <div className="relative mb-3">
                <div
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-[#F5F4F6] p-2 text-sm text-gray-600"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedOffer === "Select type of offer" ? (
                    <span className="text-gray-400">Select type of offer</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img
                        src={offerDetails[selectedOffer].icon}
                        alt={selectedOffer}
                        className="h-6 w-6"
                      />
                      <span>{selectedOffer}</span>
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md">
                    <li
                      className="cursor-pointer px-3 py-2 text-gray-400 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedOffer("Select type of offer");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Select type of offer
                    </li>
                    {(
                      Object.keys(offerDetails) as Array<
                        keyof typeof offerDetails
                      >
                    ).map((offer) => (
                      <li
                        key={offer}
                        className={`flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100 ${
                          selectedOffer === offer ? "bg-[#D9F3FD]" : ""
                        }`}
                        onClick={() => {
                          setSelectedOffer(offer);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <img
                          src={offerDetails[offer].icon}
                          alt={offer}
                          className="h-6 w-6"
                        />
                        {offer}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Display Selected Offer Details */}
              {selectedOffer !== "Select type of offer" && (
                <>
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={offerDetails[selectedOffer].icon}
                      alt={selectedOffer}
                      className="h-16 w-16"
                    />
                    <p className="text-sm text-[#5E6670]">
                      {offerDetails[selectedOffer].description}
                    </p>
                  </div>

                  <textarea
                    placeholder={`Express your offer (e.g., ${offerDetails[selectedOffer].example})`}
                    className="mb-3 h-28 w-full rounded-lg border border-gray-300 bg-[#F5F4F6] p-3 text-sm text-gray-600"
                    value={inputtext}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
                </>
              )}

              {/* Buttons */}
              <div className="mt-auto flex items-center justify-between gap-2">
                <button
                  className="w-1/2 rounded border border-[#40C3F3] bg-white px-4 py-2 text-sm text-[#40C3F3]"
                  onClick={() => setShowReviewModal(true)}
                >
                  Preview
                </button>
                <button
                  className="w-1/2 rounded bg-[#40C3F3] px-4 py-2 text-sm text-white"
                  onClick={handleSendExpression}
                  disabled={addExpression.isPending}
                >
                  {addExpression.isPending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpressionModal;
