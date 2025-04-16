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
        if (data?.inviteId) {
          const link = `${window.location.origin}/accept-invite/${data.inviteId}`;
          setInviteLink(link);
        }
        toast({
          title: "WhatsApp invite processed",
          description: "WhatsApp invite has been created",
        });
      },
      onError: () => {
        toast({
          title: "Invite failed",
          description: "Failed to create WhatsApp invite",
        });
      },
    });

  const { mutate: createEmailInvite, isPending: isEmailPending } =
    api.invite.createEmailInvite.useMutation({
      onSuccess: (data) => {
        if (data?.inviteId) {
          const link = `${window.location.origin}/accept-invite/${data.inviteId}`;
          setInviteLink(link);
        }
        toast({
          title: "Email invite processed",
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

  const handleWhatsAppShare = () => {
    if (!inviteLink) return;
    const message = encodeURIComponent(
      `Join our platform using this link: ${inviteLink}`,
    );
    const whatsappUrl = `https://wa.me/${watch("phoneNumber")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      void navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Link copied",
        description: "Invite link has been copied to clipboard",
      });
    }
  };

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

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
      <div className="relative w-2/5 rounded-xl bg-white p-6 py-10 shadow-lg">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="mb-2 text-lg font-semibold">Invite</h2>
        <p className="mb-4 text-sm text-gray-600">
          Select a role and invite members through WhatsApp or email. Choose
          your preferred method to send invitations and collaborate with your
          team.
        </p>
        <hr className="mb-4" />
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-700">Role</label>
            <Select
              onValueChange={(value: (typeof ROLES)[number]) =>
                setValue("role", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {watch("role") && (
            <>
              <div className="relative mb-2">
                <label className="mb-2 block text-sm text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-3 flex items-center pl-12 text-gray-700">
                    +91
                  </div>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-[#F4F4F5] p-3 pl-20"
                    placeholder="Phone Number"
                    {...register("phoneNumber", {
                      pattern: /^[0-9]{10}$/,
                    })}
                  />
                  <img
                    src="/assets/images/whatsappicon.png"
                    alt=""
                    className="absolute bottom-4 left-4 h-5 w-5"
                  />
                </div>
                {errors.phoneNumber && (
                  <span className="text-sm text-red-500">
                    Invalid phone number
                  </span>
                )}
              </div>

              <Button
                type="button"
                onClick={handleWhatsAppInvite}
                className="mt-2 w-full transition-all duration-200"
                variant={
                  watch("phoneNumber")?.length === 10 ? "default" : "outline"
                }
                disabled={
                  watch("phoneNumber")?.length !== 10 || isWhatsAppPending
                }
              >
                {isWhatsAppPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src="/assets/images/whatsappicon.png"
                      alt=""
                      className="h-4 w-4"
                    />
                    <span>Invite via WhatsApp</span>
                  </div>
                )}
              </Button>

              <span className="flex flex-row items-center justify-center">
                <hr className="w-1/2" />
                <div className="relative top-2 mx-2 mb-4 text-center text-gray-500">
                  {" "}
                  OR{" "}
                </div>{" "}
                <hr className="w-1/2" />
              </span>

              <label className="mb-2 block text-sm font-semibold text-black">
                Enter email <span className="text-gray-500">*</span>
              </label>
              <input
                type="email"
                className="mb-4 w-full rounded-lg border border-gray-300 bg-[#F4F4F5] p-3"
                placeholder="Enter email"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}

              <Button
                type="button"
                onClick={handleEmailInvite}
                className="w-full transition-all duration-200"
                variant={
                  watch("email") && !errors.email ? "default" : "outline"
                }
                disabled={!watch("email") || !!errors.email || isEmailPending}
              >
                {isEmailPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Invite via Email</span>
                  </div>
                )}
              </Button>

              {inviteLink && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border p-3">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-1 bg-transparent"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="px-3"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          <hr className="mb-4 mt-4" />

          <div className="mt-6 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
