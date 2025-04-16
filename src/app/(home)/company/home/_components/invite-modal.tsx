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

type FormValues = {
  phoneNumber: string;
  role: (typeof ROLES)[number];
  email: string;
};

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
      phoneNumber: "",
      email: "",
      role: undefined,
    },
  });

  const { toast } = useToast();

  const [inviteLink, setInviteLink] = React.useState<string | null>(null);

  const { mutate: createWhatsAppInvite, isPending: isWhatsAppPending } =
    api.invite.createWhatsAppInvite.useMutation({
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
    api.invite.createEmailInvite.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Invite processed successfully",
          description: "Email invite has been created",
        });
      },
      onError: () => {
        toast({
          title: "Invite failed",
          description: "Failed to create email invite",
        });
      },
    });

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
    if (!watch("phoneNumber") || !watch("role")) return;

    createWhatsAppInvite({
      role: watch("role"),
      phoneNumber: watch("phoneNumber"),
      baseUrl: window.location.origin,
    });
  };

  const handleEmailInvite = () => {
    if (!watch("email") || !watch("role")) return;

    createEmailInvite({
      role: watch("role"),
      email: watch("email"),
      baseUrl: window.location.origin,
    });
  };

  console.log(watch("role"));

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white p-4 py-8 shadow-lg sm:w-4/5 sm:p-6 sm:py-10 md:w-3/5 lg:w-2/5">
        <button
          className="absolute right-2 top-2 text-gray-500 hover:text-black sm:right-4 sm:top-4"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="mb-2 text-base font-semibold sm:text-lg">Invite</h2>
        <p className="mb-4 text-xs text-gray-600 sm:text-sm">
          Select a role and invite members through WhatsApp or email. Choose
          your preferred method to send invitations and collaborate with your
          team.
        </p>
        <hr className="mb-4" />
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="mb-2 block text-xs text-gray-700 sm:text-sm">
              Role
            </label>
            <Select
              onValueChange={(value: (typeof ROLES)[number]) =>
                setValue("role", value)
              }
            >
              <SelectTrigger className="w-full text-xs sm:text-sm">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className="text-xs sm:text-sm"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {watch("role") && (
            <>
              <div className="relative mb-2">
                <label className="mb-2 block text-xs text-gray-700 sm:text-sm">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-2 flex items-center pl-8 text-xs text-gray-700 sm:top-3 sm:pl-12 sm:text-sm">
                    +91
                  </div>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-[#F4F4F5] p-2 pl-16 text-xs sm:p-3 sm:pl-20 sm:text-sm"
                    placeholder="Phone Number"
                    {...register("phoneNumber", {
                      pattern: /^[0-9]{10}$/,
                    })}
                  />
                  <img
                    src="/assets/images/whatsappicon.png"
                    alt=""
                    className="absolute bottom-2 left-2 h-4 w-4 sm:bottom-4 sm:left-4 sm:h-5 sm:w-5"
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
                className="mt-2 h-auto w-full py-1.5 text-xs transition-all duration-200 sm:py-2 sm:text-sm"
                variant={
                  watch("phoneNumber")?.length === 10 ? "default" : "outline"
                }
                disabled={
                  watch("phoneNumber")?.length !== 10 || isWhatsAppPending
                }
              >
                {isWhatsAppPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <img
                      src="/assets/images/whatsappicon.png"
                      alt=""
                      className="h-3 w-3 sm:h-4 sm:w-4"
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
                Enter email <span className="text-gray-500">*</span>
              </label>
              <input
                type="email"
                className="mb-4 w-full rounded-lg border border-gray-300 bg-[#F4F4F5] p-2 text-xs sm:p-3 sm:text-sm"
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
                className="h-auto w-full py-1.5 text-xs transition-all duration-200 sm:py-2 sm:text-sm"
                variant={
                  watch("email") && !errors.email ? "default" : "outline"
                }
                disabled={!watch("email") || !!errors.email || isEmailPending}
              >
                {isEmailPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Invite via Email</span>
                  </div>
                )}
              </Button>
            </>
          )}

          <hr className="mb-4 mt-4" />

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-auto py-1.5 text-xs sm:py-2 sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
