"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type VerificationFormValues = {
  phone: string;
  email: string;
};

interface VerificationModalProps {
  email?: string;
  phoneNumber?: string;
  id: string;
  role: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  email,
  phoneNumber,
  id,
  role,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [phoneOtp, setPhoneOtp] = React.useState("");
  const [emailOtp, setEmailOtp] = React.useState("");
  const [showPhoneOtp, setShowPhoneOtp] = React.useState(false);
  const [showEmailOtp, setShowEmailOtp] = React.useState(false);
  const [phoneVerified, setPhoneVerified] = React.useState(false);
  const [emailVerified, setEmailVerified] = React.useState(false);
  const [phoneTimer, setPhoneTimer] = React.useState(0);
  const [emailTimer, setEmailTimer] = React.useState(0);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<VerificationFormValues>({
    defaultValues: {
      phone: phoneNumber ?? "",
      email: email ?? "",
    },
  });

  const { mutate: sendPhoneOtp, isPending: sendingPhoneOtp } =
    api.invite.sendPhoneOtp.useMutation({
      onSuccess: () => {
        setShowPhoneOtp(true);
        setPhoneTimer(30);
        toast({
          description: "OTP sent to phone",
        });
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: sendEmailOtp, isPending: sendingEmailOtp } =
    api.invite.sendEmailOtp.useMutation({
      onSuccess: () => {
        setShowEmailOtp(true);
        setEmailTimer(30);
        toast({
          description: "OTP sent to email",
        });
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutateAsync: verifyAcceptInvite, isPending: verifyingAcceptInvite } =
    api.invite.verifyAcceptInvite.useMutation({
      onSuccess: (data) => {
        if (data.isExistingMember) {
          toast({
            title: "Welcome back",
            description: "Invited accepted successfully",
          });
          router.push("/individual/home");
          return;
        }

        toast({
          description: "Verification complete",
        });
        router.push("/individual/account-setup");
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: verifyPhoneOtpMutation } = api.otp.verifyPhoneOtp.useMutation(
    {
      onSuccess: () => {
        setPhoneVerified(true);
        toast({
          description: "Phone number verified successfully",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          description: error.message || "Failed to verify phone OTP",
        });
        setPhoneOtp("");
      },
    },
  );

  const { mutate: verifyEmailOtpMutation } = api.otp.verifyEmailOtp.useMutation(
    {
      onSuccess: () => {
        setEmailVerified(true);
        toast({
          description: "Email verified successfully",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          description: error.message || "Failed to verify email OTP",
        });
        setEmailOtp("");
      },
    },
  );

  const handlePhoneOtp = (value: string) => {
    setPhoneOtp(value);
  };

  const handleEmailOtp = (value: string) => {
    setEmailOtp(value);
  };

  const verifyPhoneOtp = () => {
    if (phoneOtp.length === 4) {
      verifyPhoneOtpMutation({
        phone: watch("phone"),
        otp: phoneOtp,
      });
    }
  };

  const verifyEmailOtp = () => {
    if (emailOtp.length === 4) {
      verifyEmailOtpMutation({
        email: watch("email"),
        otp: emailOtp,
      });
    }
  };

  React.useEffect(() => {
    let phoneInterval: NodeJS.Timeout;
    if (phoneTimer > 0) {
      phoneInterval = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(phoneInterval);
  }, [phoneTimer]);

  React.useEffect(() => {
    let emailInterval: NodeJS.Timeout;
    if (emailTimer > 0) {
      emailInterval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(emailInterval);
  }, [emailTimer]);

  const handleVerificationComplete = async () => {
    await verifyAcceptInvite({
      inviteId: id,
      phone: watch("phone"),
      email: watch("email"),
      role: role,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-center text-xl font-bold">Verify Your Details</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phone Verification */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="flex items-center gap-2 rounded-md border-2 border-blue-300 p-2">
            <span className="text-gray-500">+91</span>
            <input
              type="tel"
              disabled={showPhoneOtp}
              placeholder="Enter Number"
              {...register("phone", {
                pattern: /^[0-9]{10}$/,
              })}
              maxLength={10}
              className="w-full bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => sendPhoneOtp({ phone: watch("phone") })}
              disabled={!watch("phone") || phoneVerified || phoneTimer > 0}
              className="text-sm text-blue-600 disabled:text-gray-400"
            >
              {phoneVerified
                ? "Verified"
                : phoneTimer > 0
                  ? `Resend in ${phoneTimer}s`
                  : "Get OTP"}
            </button>
          </div>
        </div>

        {showPhoneOtp && !phoneVerified && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone OTP</label>
            <div className="flex gap-2">
              <InputOTP
                value={phoneOtp}
                onChange={handlePhoneOtp}
                maxLength={4}
              >
                <InputOTPSlot className="border-2 border-blue-300" index={0} />
                <InputOTPSlot className="border-2 border-blue-300" index={1} />
                <InputOTPSlot className="border-2 border-blue-300" index={2} />
                <InputOTPSlot className="border-2 border-blue-300" index={3} />
              </InputOTP>
              <Button
                onClick={verifyPhoneOtp}
                disabled={phoneOtp.length !== 4}
                variant="secondary"
              >
                Verify
              </Button>
            </div>
            {phoneVerified && (
              <p className="text-sm text-green-600">✓ Phone number verified</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="flex items-center gap-2 rounded-md border-2 border-blue-300 p-2">
            <input
              type="email"
              disabled={showEmailOtp}
              defaultValue={email}
              {...register("email")}
              className="w-full bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => sendEmailOtp({ email: watch("email") })}
              disabled={!watch("email") || emailVerified || emailTimer > 0}
              className="text-sm text-blue-600 disabled:text-gray-400"
            >
              {emailVerified
                ? "Verified"
                : emailTimer > 0
                  ? `Resend in ${emailTimer}s`
                  : "Get OTP"}
            </button>
          </div>
        </div>

        {showEmailOtp && !emailVerified && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Email OTP</label>
            <div className="flex gap-2">
              <InputOTP
                value={emailOtp}
                onChange={handleEmailOtp}
                maxLength={4}
              >
                <InputOTPSlot className="border-2 border-blue-300" index={0} />
                <InputOTPSlot className="border-2 border-blue-300" index={1} />
                <InputOTPSlot className="border-2 border-blue-300" index={2} />
                <InputOTPSlot className="border-2 border-blue-300" index={3} />
              </InputOTP>
              <Button
                onClick={verifyEmailOtp}
                disabled={emailOtp.length !== 4}
                variant="secondary"
              >
                Verify
              </Button>
            </div>
            {emailVerified && (
              <p className="text-sm text-green-600">✓ Email verified</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleVerificationComplete}
          disabled={!phoneVerified || !emailVerified}
        >
          {verifyingAcceptInvite ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
