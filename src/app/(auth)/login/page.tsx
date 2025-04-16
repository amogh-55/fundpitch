"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { getRouteToRedirectAfterLogin } from "@/lib/utils";
import Image from "next/image";

interface LoginForm {
  phone: string;
  phoneOtp: string;
}

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>();

  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [currentGif, setCurrentGif] = useState("/assets/images/gif1.gif");

  useEffect(() => {
    const switchGif = () => {
      setCurrentGif("/assets/images/gif2.gif");
      setTimeout(() => {
        setCurrentGif("/assets/images/gif1.gif");
      }, 2000);
    };

    const interval = setInterval(switchGif, 6000);
    return () => clearInterval(interval);
  }, []);

  const phone = watch("phone")?.length === 10;

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
    api.user.sendLoginPhoneOtp.useMutation({
      onSuccess: () => {
        setShowPhoneOtp(true);
        setPhoneTimer(30);
        toast({
          description: "OTP sent to phone",
          variant: "default",
          duration: 1000,
        });
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { mutate: verifyPhoneOtp, isPending: verifyingPhoneOtp } =
    api.user.verifyLoginPhoneOtp.useMutation({
      onSuccess: ({ user }) => {
        setPhoneVerified(true);
        toast({
          description: "Phone number verified successfully",
          variant: "default",
        });

        router.push(
          getRouteToRedirectAfterLogin({
            userType: user.usertype ?? "",
            individualUserId: user.individualUserId,
            companyUserId: user.companyUserId,
            individualName: user.name,
            individualDesignation: user.designation,
            individualFullAddress: user.fullAddress,
            individualBio: user.bio,
          }),
        );
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const [phoneOtp, setPhoneOtp] = useState("");

  const otp = phoneOtp.length === 4;

  const handlePhoneOtp = (phoneOtp: string) => {
    setPhoneOtp(phoneOtp);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[url('/assets/images/login-bg.png')] bg-cover bg-center px-3 sm:px-4 md:flex-row">
      {/* Back Button */}
      <button
        className="absolute left-2 top-2 flex flex-row items-center justify-center gap-1 text-gray-600 hover:text-gray-800 sm:left-4 sm:top-4 sm:gap-2"
        onClick={() => router.back()}
      >
        <Image
          src="/assets/images/back-icon.png"
          alt="Back"
          width={20}
          height={15}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
        <p className="text-xs underline sm:text-sm">Back</p>
      </button>

      {/* Main Content Container */}
      <div className="flex w-full max-w-6xl flex-col items-center justify-center md:flex-row md:gap-4 lg:gap-8 xl:gap-16">
        {/* GIF Animation - Show on all screens but adjust size */}
        <div className="mb-5 w-full max-w-xs sm:max-w-sm md:mb-0 md:w-5/12 lg:w-5/12">
          <Image
            src={currentGif}
            alt="Animation"
            width={400}
            height={400}
            priority
            className="max-w-full object-contain"
          />
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm rounded-lg bg-white p-4 sm:max-w-md sm:p-6 md:w-7/12 lg:w-5/12">
          <h1 className="mb-4 text-center text-2xl font-bold sm:mb-6 sm:text-3xl">
            Fund<span className="text-[#2595BE]">Pitch</span>
          </h1>

          <div className="mb-4 text-left">
            <label className="mb-1 block text-base font-medium text-gray-700 sm:mb-2 sm:text-lg">
              Phone Number
            </label>
            <input
              placeholder="Enter Number"
              {...register("phone", {
                required: "Phone Number is required",
              })}
              onInput={(e) =>
                (e.currentTarget.value = e.currentTarget.value
                  .replace(/\D/g, "")
                  .slice(0, 10))
              }
              disabled={phoneVerified || sendingPhoneOtp || phoneTimer > 0}
              maxLength={10}
              type="tel"
              className="w-full rounded-md border border-blue-300 bg-gray-100 p-2 sm:p-3"
            />
            {/* {phoneTimer > 0 && !phoneVerified && (
              <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
                Resend OTP in {phoneTimer}s
              </p>
            )} */}
          </div>

          {showPhoneOtp && !phoneVerified && (
            <div className="mt-3 text-left sm:mt-4">
              <label className="mb-1 block text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
                OTP
              </label>
              <div className="mb-3 flex justify-center gap-1 sm:mb-4 sm:gap-2 md:gap-4">
                <InputOTP
                  value={phoneOtp}
                  onInput={(e) =>
                    (e.currentTarget.value = e.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 4))
                  }
                  className="flex border-2"
                  maxLength={4}
                  onChange={handlePhoneOtp}
                >
                  <InputOTPSlot
                    className="h-8 w-8 border-2 border-blue-300 sm:h-10 sm:w-10 md:h-12 md:w-12"
                    index={0}
                  />
                  <InputOTPSlot
                    className="h-8 w-8 border-2 border-blue-300 sm:h-10 sm:w-10 md:h-12 md:w-12"
                    index={1}
                  />
                  <InputOTPSlot
                    className="h-8 w-8 border-2 border-blue-300 sm:h-10 sm:w-10 md:h-12 md:w-12"
                    index={2}
                  />
                  <InputOTPSlot
                    className="h-8 w-8 border-2 border-blue-300 sm:h-10 sm:w-10 md:h-12 md:w-12"
                    index={3}
                  />
                </InputOTP>
              </div>
              <button
                type="button"
                disabled={!otp || verifyingPhoneOtp}
                onClick={() =>
                  verifyPhoneOtp({
                    phone: watch("phone"),
                    otp: phoneOtp,
                  })
                }
                className="w-full rounded-md bg-blue-500 p-2 text-sm text-white transition duration-300 hover:bg-blue-600 disabled:bg-blue-200 sm:p-3 sm:text-base"
              >
                {verifyingPhoneOtp ? "Verifying..." : "Login"}
              </button>
            </div>
          )}

          {!showPhoneOtp && (
            <button
              type="button"
              disabled={!phone || sendingPhoneOtp}
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
              className="w-full rounded-md bg-blue-500 p-2 text-sm text-white transition duration-300 hover:bg-blue-600 disabled:bg-blue-200 sm:p-3 sm:text-base"
            >
              {sendingPhoneOtp ? "Sending OTP..." : "Verify"}
            </button>
          )}

          {phoneTimer > 0 && showPhoneOtp && !phoneVerified && (
            <button
              type="button"
              disabled={phoneTimer > 0}
              onClick={() => {
                if (phoneTimer === 0) {
                  const phone = watch("phone");
                  sendPhoneOtp({ phone });
                }
              }}
              className="mt-3 w-full text-sm text-blue-500 hover:underline disabled:text-gray-400"
            >
              Resend OTP {phoneTimer > 0 ? `in ${phoneTimer}s` : ""}
            </button>
          )}

          <p className="mt-6 text-center text-gray-500">
            Don&apos;t Have an Account?{" "}
            <button
              onClick={() => router.push("/categories")}
              className="font-medium text-[#007AFF] underline"
            >
              Signup
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
