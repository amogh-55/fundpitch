import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X, Share2, Mail } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";

interface InviteModalProps {
  show: boolean;
  onClose: () => void;
}

const ROLES = [
  "merchant-banker",
  "investors",
  "advisor/SME",
  "service/provider",
  "product/service",
  "consultant/facilitator",
  "others",
] as const;

interface FormValues {
  company: {
    companyId: string;
    inviteId: string;
    companyName: string;
    location: string;
    sector: string;
  };
  role: string;
  phoneNumber: string;
  email: string;
}

const InviteModal: React.FC<InviteModalProps> = ({ show, onClose }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      company: {
        companyId: "",
        inviteId: "",
        companyName: "",
        location: "",
        sector: "",
      },
      phoneNumber: "",
      email: "",
      role: "",
    },
  });

  const { toast } = useToast();

  const { mutate: createWhatsAppInvite, isPending: isWhatsAppPending } =
    api.invite.createWhatsAppIndividualInvite.useMutation({
      onSuccess: (data) => {
        console.log("WhatsApp invite response:", data);
        if (data.success) {
          toast({
            title: "WhatsApp invite processed",
            description: "WhatsApp invite has been created and message sent",
          });
        } else {
          toast({
            title: "WhatsApp invite failed",
            description: data.message || "Failed to send WhatsApp message",
            variant: "destructive",
          });
        }
      },
      onError: (error) => {
        console.error("WhatsApp invite error:", error);
        toast({
          title: "WhatsApp invite failed",
          description: error.message || "Failed to create WhatsApp invite",
          variant: "destructive",
        });
      },
    });

  const { mutate: createEmailInvite, isPending: isEmailPending } =
    api.invite.createEmailIndividualInvite.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Email invite processed",
          description: "Email invite has been created and sent",
        });
      },
      onError: () => {
        toast({
          title: "Email invite failed",
          description: "Failed to create email invite",
        });
      },
    });

  const { data: companies } = api.individual.getApprovedCompanies.useQuery();

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

  const handleWhatsAppInvite = () => {
    if (!watch("phoneNumber") || !watch("role") || !watch("company.companyId"))
      return;

    createWhatsAppInvite({
      role: watch("role"),
      phoneNumber: watch("phoneNumber"),
      baseUrl: window.location.origin,
      companyUserId: watch("company.companyId"),
      parentInviteId: watch("company.inviteId"),
    });
  };

  const handleEmailInvite = () => {
    if (!watch("email") || !watch("role") || !watch("company.companyId"))
      return;

    createEmailInvite({
      role: watch("role"),
      email: watch("email"),
      baseUrl: window.location.origin,
      companyUserId: watch("company.companyId"),
      parentInviteId: watch("company.inviteId"),
      name: companies?.user?.name ?? "",
      companyName: watch("company.companyName"),
      location: watch("company.location"),
      sector: watch("company.sector"),
    });
  };

  const selectedCompanyId = watch("company.companyId");

  const formValues = watch();
  console.log("Current form values:", formValues);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-[90%] rounded-xl bg-white shadow-lg sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]">
        {/* Header Section - Fixed */}
        <div className="sticky top-0 z-20 rounded-t-xl bg-white p-4 sm:p-5 md:p-6">
          <button
            className="absolute right-3 top-3 text-gray-500 hover:text-black sm:right-4 sm:top-4"
            onClick={onClose}
          >
            <X size={18} className="sm:h-5 sm:w-5" />
          </button>
          <h2 className="mb-2 text-base font-semibold sm:text-lg">Invite</h2>
          <p className="mb-4 text-xs text-gray-600 sm:text-sm">
            Select a role and invite members through WhatsApp or email. Choose
            your preferred method to send invitations and collaborate with your
            team.
          </p>
          <hr className="mb-0" />
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto px-4 sm:px-5 md:px-6">
          <form onSubmit={(e) => e.preventDefault()} className="py-4">
            <div className="mb-3 sm:mb-4">
              <label className="mb-2 block text-xs text-gray-700 sm:text-sm">
                Select Company
              </label>
              <Select
                onValueChange={(value: string) => {
                  console.log("Selected company value:", value);
                  const selectedCompany = companies?.companies.find(
                    (c) => c.companyId === value,
                  );
                  if (selectedCompany) {
                    setValue(
                      "company",
                      {
                        companyId: selectedCompany.companyId,
                        inviteId: selectedCompany.inviteId,
                        companyName: selectedCompany.companyName ?? "",
                        location: selectedCompany.location ?? "",
                        sector: selectedCompany.sector ?? "",
                      },
                      { shouldValidate: true },
                    );

                    setValue("role", "");
                  }
                }}
                value={selectedCompanyId}
              >
                <SelectTrigger className="h-9 w-full sm:h-10">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.companies.map((company) => (
                    <SelectItem
                      key={company.companyId}
                      value={company.companyId}
                    >
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCompanyId && selectedCompanyId !== "" ? (
              <div className="mb-3 sm:mb-4">
                <label className="mb-2 block text-xs text-gray-700 sm:text-sm">
                  Role
                </label>
                <Select
                  onValueChange={(value: (typeof ROLES)[number]) =>
                    setValue("role", value)
                  }
                  value={watch("role")}
                >
                  <SelectTrigger className="h-9 w-full sm:h-10">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div className="mt-1 text-xs text-gray-500">
              Selected Company ID: {selectedCompanyId || "None"}
            </div>

            {watch("company.companyId") && watch("role") && (
              <>
                <div className="relative mb-2">
                  <label className="mb-2 block text-xs text-gray-700 sm:text-sm">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-0 top-2.5 flex items-center pl-10 text-xs text-gray-700 sm:top-3 sm:pl-12 sm:text-sm">
                      +91
                    </div>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 bg-[#F4F4F5] p-2.5 pl-16 text-xs sm:p-3 sm:pl-20 sm:text-sm"
                      placeholder="Phone Number"
                      {...register("phoneNumber", {
                        pattern: /^[0-9]{10}$/,
                      })}
                    />
                    <img
                      src="/assets/images/whatsappicon.png"
                      alt=""
                      className="absolute bottom-2.5 left-3 h-4 w-4 sm:bottom-4 sm:left-4 sm:h-5 sm:w-5"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <span className="text-xs text-red-500 sm:text-sm">
                      Invalid phone number
                    </span>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleWhatsAppInvite}
                  className="mt-2 h-9 w-full text-xs transition-all duration-200 sm:h-10 sm:text-sm"
                  variant={
                    watch("phoneNumber")?.length === 10 ? "default" : "outline"
                  }
                  disabled={
                    watch("phoneNumber")?.length !== 10 || isWhatsAppPending
                  }
                >
                  {isWhatsAppPending ? (
                    <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src="/assets/images/whatsappicon.png"
                        alt=""
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      />
                      <span>Invite via WhatsApp</span>
                    </div>
                  )}
                </Button>

                <span className="my-3 flex flex-row items-center justify-center sm:my-4">
                  <hr className="w-1/2" />
                  <div className="relative mx-2 text-center text-xs text-gray-500 sm:text-sm">
                    OR
                  </div>
                  <hr className="w-1/2" />
                </span>

                <label className="mb-2 block text-xs font-semibold text-black sm:text-sm">
                  Enter emails <span className="text-gray-500">*</span>
                </label>
                <input
                  type="email"
                  className="mb-4 w-full rounded-lg border border-gray-300 bg-[#F4F4F5] p-2.5 text-xs sm:p-3 sm:text-sm"
                  placeholder="Enter email"
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-xs text-red-500 sm:text-sm">
                    {errors.email.message}
                  </span>
                )}

                <Button
                  type="button"
                  onClick={handleEmailInvite}
                  className="h-9 w-full text-xs transition-all duration-200 sm:h-10 sm:text-sm"
                  variant={
                    watch("email") && !errors.email ? "default" : "outline"
                  }
                  disabled={!watch("email") || !!errors.email || isEmailPending}
                >
                  {isEmailPending ? (
                    <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>Invite via Email</span>
                    </div>
                  )}
                </Button>
              </>
            )}

            <hr className="mb-4 mt-4" />
          </form>
        </div>

        {/* Footer Section - Fixed */}
        <div className="sticky bottom-0 z-20 rounded-b-xl border-t bg-white p-4 sm:p-5 md:p-6">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-xs sm:h-10 sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
