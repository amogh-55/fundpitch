"use client";

import React, { useState, lazy, Suspense } from "react";
import Navbar from "./_components/Navbar";
import CompanyDetailsCard from "./_components/CompanyDetailsCard";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const HomeContent = lazy(
  () => import("./_components/bar-contents/home-content"),
);
const TeamContent = lazy(
  () => import("./_components/bar-contents/team-content"),
);
const BusinessVerticalsContent = lazy(
  () => import("./_components/bar-contents/business-verticals-content"),
);
const SubsidiariesContent = lazy(
  () => import("./_components/bar-contents/subsidiaries-content"),
);
const DocumentsContent = lazy(
  () => import("./_components/bar-contents/documents-content"),
);
const TimelineContent = lazy(
  () => import("./_components/bar-contents/timeline-content"),
);
const InviteJourneyContent = lazy(
  () => import("./_components/bar-contents/invite-journey"),
);
const ProductContent = lazy(
  () => import("./_components/bar-contents/product-content"),
);
const AnalyticsContent = lazy(
  () => import("./_components/bar-contents/analytics-content"),
);
const ExpressionsContent = lazy(
  () => import("./_components/bar-contents/expressions-content"),
);

const FundPitch = () => {
  const getUser = api.user.getUser.useQuery();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Home");

  const renderContent = () => {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">Loading...</div>
        }
      >
        {(() => {
          switch (activeTab) {
            case "Home":
              return <HomeContent />;
            case "Teams":
              return <TeamContent />;
            case "Business Verticals":
              return <BusinessVerticalsContent />;
            // case "Subsidiaries":
            //   return <SubsidiariesContent />;
            case "Documents":
              return <DocumentsContent />;
            case "Timeline":
              return <TimelineContent />;
            case "Invite Journey":
              return <InviteJourneyContent />;
            case "Product":
              return <ProductContent />;
            case "Analytics":
              return <AnalyticsContent />;
            case "Expressions":
              return <ExpressionsContent />;
            default:
              return <HomeContent />;
          }
        })()}
      </Suspense>
    );
  };

  if (getUser.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!getUser.data) {
    router.push("/login");
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="w-full">
        <Navbar onTabChange={setActiveTab} activeTab={activeTab} />
        <div className="flex w-full flex-col">
          <div className="mt-6 w-full px-4 sm:px-6 md:px-8">
            <CompanyDetailsCard />
          </div>
          <div className="mt-auto h-full w-full">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default FundPitch;
