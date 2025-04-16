"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { Suspense } from "react";
import { HomeIcon } from "lucide-react";

interface Signupform {
  phone: string;
  email: string;
  userType: string;
  phoneOtp: string;
  emailOtp: string;
  whatsappConsent: boolean;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userType = searchParams.get("userType");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Signupform>({
    defaultValues: {
      userType: userType ?? "",
      whatsappConsent: false,
    },
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [ShowEmailOtp, setShowEmailOtp] = useState(false);

  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phoneTimer > 0) {
      interval = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneTimer]);

  const { mutate: sendPhoneOtp, isPending: sendingPhoneOtp } =
    api.otp.sendPhoneOtp.useMutation({
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
    api.otp.sendEmailOtp.useMutation({
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

  const [phoneOtp, SetphoneOtp] = useState("");

  const otpVerifyPhone = phoneOtp.length === 4;

  const handlePhoneOtp = (phoneOtp: string) => {
    SetphoneOtp(phoneOtp);
  };

  const { mutate: verifyPhoneOtp, isPending: verifyingPhoneOtp } =
    api.otp.verifyPhoneOtp.useMutation({
      onSuccess: () => {
        setPhoneVerified(true);
        toast({
          description: "Phone number verified successfully",
        });
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const [emailOtp, SetemailOtp] = useState("");

  const otpVerifyEmail = emailOtp.length === 4;

  const handleEmailOtp = (emailOtp: string) => {
    SetemailOtp(emailOtp);
  };

  const { mutate: verifyEmailOtp, isPending: verifyingEmailOtp } =
    api.otp.verifyEmailOtp.useMutation({
      onSuccess: () => {
        setEmailVerified(true);
        toast({
          description: "Email verified successfully",
        });
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate, isPending } = api.user.registerUser.useMutation({
    onSuccess: ({ user }) => {
      toast({
        description: "Account created successfully",
      });
      if (user.userType === "company-founder") {
        router.push("/company/account-setup/basic-details");
      } else {
        router.push("/individual/account-setup");
      }
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
    },
  });

  const onSubmit = (data: Signupform) => {
    const requiredfield = (watch("email"), watch("phone"), watch("userType"));
    if (!requiredfield) {
      toast({
        description: "Fill all the details",
      });
    } else mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-screen bg-[url('/assets/images/login-bg.png')] bg-cover bg-center md:items-center md:justify-center">
        <div className="flex gap-4">
          <button
            type="button"
            className="absolute left-2 top-4 flex flex-row items-center justify-center gap-2 text-gray-600 hover:text-gray-800 md:left-14 md:top-14"
            onClick={() => router.back()}
          >
            <img
              src="/assets/images/back-icon.png"
              alt=""
              className="h-3 w-3 md:h-5 md:w-5"
            />
            <p className="text-xs underline md:text-sm">Back</p>
          </button>

          <button
            type="button"
            className="absolute right-2 top-4 flex flex-row items-center justify-center gap-2 text-gray-600 hover:text-[#007bffa3] md:right-14 md:top-14"
            onClick={() => router.push("/")}
          >
            <HomeIcon className="h-3 w-3 md:h-5 md:w-5" />
            <p className="text-xs underline md:text-sm">Home</p>
          </button>
        </div>

        <div className="mt-6 w-full rounded-lg p-4 text-center md:mt-0 md:w-1/3 md:p-10">
          <h1 className="mb-6 text-3xl font-bold">
            Fund<span className="text-[#2595BE]">Pitch</span>
          </h1>

          <div className="mb-5 flex flex-col gap-2 text-left">
            <label className="text-sm font-medium text-gray-700 md:text-lg">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex h-12 items-center gap-2 rounded-md border-2 border-blue-300 p-2 px-3">
              <span className="font-medium text-gray-500">+91</span>
              <input
                type="tel"
                disabled={phoneVerified}
                placeholder="Enter Number"
                inputMode="numeric"
                pattern="[0-9]*"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter valid 10-digit number",
                  },
                })}
                onInput={(e) =>
                  (e.currentTarget.value = e.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 10))
                }
                maxLength={10}
                className={`w-full bg-transparent outline-none ${
                  phoneVerified || showPhoneOtp ? "cursor-not-allowed" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  const phone = watch("phone");
                  if (!/^[0-9]{10}$/.test(phone)) {
                    toast({
                      description: "Please enter a valid 10 digit phone number",
                      variant: "destructive",
                    });
                    return;
                  }
                  sendPhoneOtp({ phone });
                }}
                disabled={
                  !watch("phone") ||
                  phoneVerified ||
                  sendingPhoneOtp ||
                  phoneTimer > 0
                }
                className={`rounded-md px-2 py-1 text-sm ${
                  !phoneVerified
                    ? "text-[#007bff] hover:text-[#007bffa3]"
                    : "text-gray-500"
                }`}
              >
                {phoneVerified
                  ? "Verified"
                  : sendingPhoneOtp
                    ? "Sending..."
                    : phoneTimer > 0
                      ? `Resend in ${phoneTimer}s`
                      : "Get OTP"}
              </button>
            </div>
          </div>

          {showPhoneOtp && !phoneVerified && (
            <div className="mt-2 text-left">
              <label className="text-sm font-semibold text-gray-700">
                Phone OTP
              </label>
              <div className="mb-2 mt-2 flex flex-row gap-4">
                <InputOTP
                  value={phoneOtp}
                  onInput={(e) =>
                    (e.currentTarget.value = e.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 4))
                  }
                  className="border-2"
                  maxLength={4}
                  onChange={handlePhoneOtp}
                >
                  <InputOTPSlot
                    className="h-10 w-10 border-2 border-blue-300"
                    index={0}
                  />
                  <InputOTPSlot
                    className="h-10 w-10 border-2 border-blue-300"
                    index={1}
                  />
                  <InputOTPSlot
                    className="h-10 w-10 border-2 border-blue-300"
                    index={2}
                  />
                  <InputOTPSlot
                    className="h-10 w-10 border-2 border-blue-300"
                    index={3}
                  />
                </InputOTP>
                <button
                  onClick={() =>
                    verifyPhoneOtp({
                      phone: watch("phone"),
                      otp: phoneOtp,
                    })
                  }
                  type="button"
                  disabled={!otpVerifyPhone}
                  className={`bg-blue-600 px-6 py-2 text-sm text-white disabled:bg-blue-200`}
                >
                  {phoneVerified ? "Verified" : "Verify"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2 text-left">
            <label className="text-sm font-medium text-gray-700 md:text-lg">
              Email<span className="text-red-500">*</span>
            </label>
            <div className="flex h-12 items-center gap-2 rounded-md border-2 border-blue-300 p-2 px-3">
              <input
                type="email"
                placeholder="Enter Email"
                disabled={emailVerified}
                {...register("email", { required: "Email is required" })}
                className="w-full bg-transparent outline-none"
              />
              <button
                type="button"
                disabled={
                  !watch("email") ||
                  emailVerified ||
                  sendingEmailOtp ||
                  emailTimer > 0
                }
                onClick={() => {
                  const email = watch("email");
                  const emailRegex =
                    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                  if (!emailRegex.test(email)) {
                    toast({
                      description: "Invalid email format.",
                      variant: "destructive",
                    });
                    return;
                  }
                  sendEmailOtp({ email });
                }}
                className={`rounded-md px-3 py-1 text-sm ${
                  !emailVerified
                    ? "text-[#007bff] hover:text-[#007bffa3]"
                    : "text-gray-500"
                }`}
              >
                {emailVerified
                  ? "Verified"
                  : sendingEmailOtp
                    ? "Sending..."
                    : emailTimer > 0
                      ? `Resend in ${emailTimer}s`
                      : "Get OTP"}
              </button>
            </div>
          </div>

          {ShowEmailOtp && !emailVerified && (
            <div className="mt-2 text-left">
              <label className="text-sm font-semibold text-gray-700">
                Email OTP
              </label>
              <div className="mb-2 mt-2 flex flex-row gap-4">
                <InputOTP
                  value={emailOtp}
                  onChange={handleEmailOtp}
                  onInput={(e) =>
                    (e.currentTarget.value = e.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 10))
                  }
                  className="w-full"
                  maxLength={4}
                >
                  <InputOTPSlot
                    className="h-10 w-10 border-2 border-blue-300"
                    index={0}
                  />
                  <InputOTPSlot
                    className="h-10 w-10 border-2 border-blue-300"
                    index={1}
                  />
                  <InputOTPSlot
                    className="h-10 w-10 border-2 border-blue-300"
                    index={2}
                  />
                  <InputOTPSlot
                    className="h-10 w-10 border-2 border-blue-300"
                    index={3}
                  />
                </InputOTP>
                <button
                  onClick={() =>
                    verifyEmailOtp({
                      email: watch("email"),
                      otp: emailOtp,
                    })
                  }
                  type="button"
                  disabled={!otpVerifyEmail}
                  className={`bg-blue-600 px-6 py-2 text-sm text-white disabled:bg-blue-200`}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-start gap-2">
            <input
              type="checkbox"
              id="whatsappConsent"
              {...register("whatsappConsent", { required: true })}
              className="mt-1 h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="whatsappConsent" className="text-sm text-gray-600">
              By signing up into the platform you agree to receive updates
              through WhatsApp
            </label>
          </div>

          <button
            type="submit"
            disabled={
              !phoneVerified ||
              !emailVerified ||
              !watch("userType") ||
              !watch("whatsappConsent")
            }
            className={`mt-4 w-full rounded-md bg-blue-500 p-3 text-white transition duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-200`}
          >
            Signup →
          </button>
          <p className="ml-6 mt-5 text-gray-500">
            Have an Account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-[#007AFF] underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div>
            <h1 className="mb-6 text-3xl font-bold">
              Fund<span className="text-[#2595BE]">Pitch</span>
            </h1>
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}
