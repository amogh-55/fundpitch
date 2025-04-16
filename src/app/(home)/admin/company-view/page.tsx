/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, lazy, Suspense } from "react";
import Navbar from "./_components/Navbar";
import CompanyDetailsCard from "./_components/CompanyDetailsCard";
import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import NotFound from "./_components/not-found";

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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <NotFound />;
  }

  const renderContent = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {(() => {
          switch (activeTab) {
            case "Home":
              return <HomeContent id={id} />;
            case "Teams":
              return <TeamContent id={id} />;
            case "Business Verticals":
              return <BusinessVerticalsContent id={id} />;
            case "Subsidiaries":
              return <SubsidiariesContent id={id} />;
            case "Documents":
              return <DocumentsContent id={id} />;
            case "Timeline":
              return <TimelineContent id={id} />;
            case "Invite Journey":
              return <InviteJourneyContent id={id} />;
            case "Product":
              return <ProductContent id={id} />;
            case "Analytics":
              return <AnalyticsContent id={id} />;
            // case "Expressions":
            //   return <ExpressionsContent id={id} />;
            default:
              return <HomeContent id={id} />;
          }
        })()}
      </Suspense>
    );
  };

  if (getUser.isLoading) {
    return <div>Loading...</div>;
  }

  if (!getUser.data) {
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onTabChange={setActiveTab} activeTab={activeTab} />
      <div className="flex h-full flex-col">
        <div className="mt-6">
          <CompanyDetailsCard id={id} />
        </div>
        <div className="mt-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default FundPitch;
