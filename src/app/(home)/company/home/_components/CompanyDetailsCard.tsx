/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  Globe,
  BarChartBig,
  TrendingUp,
  Calendar,
  UserCircle2Icon,
  FileText,
  Users,
  X,
  LoaderCircle,
} from "lucide-react";
import InviteModal from "./invite-modal";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Companypercentage from "./percentage";

const AdvisorModal = ({
  isOpen,
  onClose,
  data,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    name: string;
    photo: string;
    userType: string;
  }[];
  type: "advisor/SME" | "product/service";
}) => {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-sm md:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle>
            {type === "advisor/SME"
              ? "Connected Advisors"
              : "Connected Product/Services Clients"}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[300px] space-y-4 overflow-y-auto sm:max-h-[400px]">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex cursor-pointer items-center space-x-4 p-2 hover:bg-gray-100"
              onClick={() => {
                onClose();
                router.push(`/individual-overview?id=${item.id}`);
              }}
            >
              <img
                src={item.photo ?? "/assets/images/profile.png"}
                alt={item.name ?? ""}
                className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
              />
              <div>
                <p className="text-sm font-semibold sm:text-base">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 sm:text-sm">
                  {item.userType}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CompanyDetailsCard = () => {
  const [isInviteTrue, setIsInviteTrue] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [modalData, setModalData] = useState<
    {
      id: string;
      name: string;
      photo: string;
      userType: string;
    }[]
  >([]);
  const [modalType, setModalType] = useState<"product/service" | "advisor/SME">(
    "product/service",
  );

  const openModal = (
    type: "product/service" | "advisor/SME",
    data: {
      id: string;
      name: string;
      photo: string;
      userType: string;
    }[],
  ) => {
    setModalType(type);
    setModalData(data);
    setIsAdvisorModalOpen(true);
  };

  const { data: companyDetails, isLoading: userBasicDetails } =
    api.company.getBasicDetails.useQuery();

  const { data: advisors } = api.company.getConnectedAdvisors.useQuery(
    undefined,
    {
      select: (advisors) =>
        advisors?.filter(
          (advisor) =>
            advisor.userType === "advisor/SME" ||
            advisor.userType === "Advisor/SME",
        ),
    },
  );

  const sortedAdvisors = (advisors ?? []).sort((a, b) =>
    b.id.localeCompare(a.id),
  );

  // First 3 most recent advisors
  const connectedAdvisors = sortedAdvisors.slice(0, 3);

  // All advisors sorted by most recent
  const allAdvisors = sortedAdvisors;

  // product/service
  const { data: productService } = api.company.getConnectedAdvisors.useQuery(
    undefined,
    {
      select: (productService) =>
        productService?.filter(
          (productService) =>
            productService.userType === "product/service" ||
            productService.userType === "Product / Service Clients",
        ),
    },
  );

  const sortedProductService = (productService ?? []).sort((a, b) =>
    b.id.localeCompare(a.id),
  );

  // First 3 most recent advisors
  const connectedProductService = sortedProductService.slice(0, 3);

  // All advisors sorted by most recent
  const allProductService = sortedProductService;

  const router = useRouter();

  const { data: user, isLoading: userIsLoading } = api.user.getUser.useQuery();

  if (userBasicDetails && userIsLoading) {
    return <div>...Loading</div>;
  }

  return (
    <>
      {isInviteTrue && (
        <div className="z-10 overflow-hidden">
          <InviteModal
            show={isInviteTrue}
            onClose={() => setIsInviteTrue(false)}
          />
        </div>
      )}

      <AdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        data={modalData}
        type={modalType}
      />
      <div className="w-full bg-gray-100 p-2 sm:p-4 md:p-6">
        <Card className="relative flex w-full flex-col items-center gap-4 p-3 sm:gap-6 sm:p-4 md:flex-row md:gap-8 md:p-6">
          <div className="absolute right-2 top-2 sm:right-4 sm:top-4">
            <Button
              onClick={() => setIsInviteTrue(true)}
              className="flex items-center gap-1 rounded-full bg-[#F6F8FC] px-2 py-1 text-white shadow-none hover:bg-[#dcdfe5] hover:shadow-sm sm:gap-2 sm:px-3 sm:py-2"
            >
              <p className="whitespace-nowrap text-[10px] text-[#595959] sm:text-xs">
                Invite Individuals
              </p>{" "}
              <UserCircle2Icon className="h-3 w-3 text-[#595959] sm:h-4 sm:w-4" />
            </Button>
          </div>
          <div className="relative mt-8 flex flex-col items-center sm:mt-6 md:mt-0">
            <div className="ml-2 flex flex-col items-center">
              <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#40C3F3] bg-white text-center sm:h-32 sm:w-32 md:h-48 md:w-48">
                <img
                  src={
                    companyDetails?.photo ?? "/assets/images/companylogo.png"
                  }
                  alt="Profile Picture"
                  className="h-full w-full cursor-pointer rounded-full object-cover"
                />
              </span>
              <div className="relative bottom-5">
                <Companypercentage id={user?.id ?? ""} />
              </div>
            </div>
          </div>
          <div className="mt-8 w-full flex-1 md:mt-0">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <h1 className="max-w-full break-words text-center text-lg font-bold text-gray-600 sm:text-xl md:text-left md:text-2xl">
                {companyDetails?.companyName}
              </h1>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <User className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Type</span>
                </p>
                <p className="mb-1 break-words pl-4 text-[10px] text-gray-500 sm:mb-2 sm:pl-6 sm:text-xs">
                  {companyDetails?.class}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <Briefcase className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Industry</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.sectors}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <Mail className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Email</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.companyEmailID}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <MapPin className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Address</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.companyAddress}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <Phone className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Office Phone</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.officePhone}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <Globe className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Website</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.companyWebsiteURL}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <BarChartBig className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Market Cap</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.marketCapital}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <TrendingUp className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Stage</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.stage}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <Calendar className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Founded Year</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.yearOfIncorporation}
                </p>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-700 sm:gap-2 sm:text-xs">
                  <FileText className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />{" "}
                  <span>Registration Number</span>
                </p>
                <p className="break-words pl-4 text-[10px] text-gray-500 sm:pl-6 sm:text-xs">
                  {companyDetails?.registartionNumber}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-6 md:flex-row md:gap-8">
              <div className="flex flex-row flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 sm:gap-2">
                  <img
                    src="/assets/images/idea.png"
                    alt=""
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  />
                  <h2 className="whitespace-nowrap text-[10px] font-semibold text-[#40C3F3] sm:text-xs">
                    Advisors
                  </h2>
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {connectedAdvisors?.map((advisor, index) => (
                      <div
                        key={advisor.id}
                        className="group relative cursor-pointer"
                        onClick={() => {
                          router.push(`/individual-overview?id=${advisor.id}`);
                        }}
                      >
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-black bg-opacity-70 px-2 py-1 text-xs text-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100">
                          <p className="text-xs">{advisor.name}</p>
                        </div>

                        <img
                          src={advisor.photo ?? "/assets/images/profile.png"}
                          alt={advisor.name ?? ""}
                          className="h-6 w-6 rounded-full object-cover ring-2 ring-white transition-transform duration-300 hover:-translate-y-1"
                        />
                      </div>
                    ))}
                  </div>

                  {advisors && advisors.length > 3 && (
                    <div
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-600 bg-gray-200 text-xs text-gray-600 hover:bg-gray-100"
                      onClick={() =>
                        openModal(
                          "advisor/SME",
                          advisors.map((advisor) => ({
                            id: advisor.id,
                            name: advisor.name ?? "",
                            photo: advisor.photo ?? "",
                            userType: advisor.userType ?? "",
                          })),
                        )
                      }
                    >
                      +{advisors.length - 3}
                    </div>
                  )}

                  {(!connectedAdvisors || connectedAdvisors.length === 0) && (
                    <div className="text-xs text-gray-500">
                      No Advisor/SME found
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 sm:gap-2">
                  <img
                    src="/assets/images/ProductServiceClients.png"
                    alt=""
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  />
                  <h2 className="whitespace-nowrap text-[10px] font-semibold text-[#40C3F3] sm:text-xs">
                    Product/Service Clients
                  </h2>
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {connectedProductService?.map((productService, index) => (
                      <div
                        key={productService.id}
                        className="group relative cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/individual-overview?id=${productService.id}`,
                          );
                        }}
                      >
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-black bg-opacity-70 px-2 py-1 text-xs text-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100">
                          <p className="text-xs">{productService.name}</p>
                        </div>

                        <img
                          src={
                            productService.photo ?? "/assets/images/profile.png"
                          }
                          alt={productService.name ?? ""}
                          className="h-6 w-6 rounded-full object-cover ring-2 ring-white transition-transform duration-300 hover:-translate-y-1"
                        />
                      </div>
                    ))}
                  </div>

                  {connectedProductService &&
                    connectedProductService.length > 3 && (
                      <div
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-600 bg-gray-200 text-xs text-gray-600 hover:bg-gray-100"
                        onClick={() =>
                          openModal(
                            "product/service",
                            connectedProductService.map((productService) => ({
                              id: productService.id,
                              name: productService.name ?? "",
                              photo: productService.photo ?? "",
                              userType: productService.userType ?? "",
                            })),
                          )
                        }
                      >
                        +{connectedProductService.length - 3}
                      </div>
                    )}

                  {(!connectedProductService ||
                    connectedProductService.length === 0) && (
                    <div className="text-xs text-gray-500">
                      No Product/Service found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CompanyDetailsCard;
