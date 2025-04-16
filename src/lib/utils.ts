import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRouteToRedirectAfterLogin = ({
  userType,
  individualUserId,
  companyUserId,
  individualName,
  individualDesignation,
  individualFullAddress,
  individualBio,
}: {
  userType: string;
  individualUserId: string | null;
  companyUserId: string | null;
  individualName: string | null;
  individualDesignation: string | null;
  individualFullAddress: string | null;
  individualBio: string | null;
}) => {
  if (
    userType === "individual" ||
    userType === "merchant-banker" ||
    userType === "investors" ||
    userType === "advisor/SME" ||
    userType === "service/provider" ||
    userType === "product/service" ||
    userType === "admin" ||
    userType === "consultant/facilitator" ||
    userType === "others"
  ) {
    if (
      individualUserId &&
      individualName &&
      individualDesignation &&
      individualFullAddress &&
      individualBio
    ) {
      return `/individual/home`;
    }
    return `/individual/account-setup`;
  } else if (userType === "company-founder") {
    if (companyUserId) {
      return `/company/home`;
    }
    return `/company/account-setup/basic-details`;
  }

  throw new Error("Invalid user type");
};
