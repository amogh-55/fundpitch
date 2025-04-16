"use client";

import { db } from "@/server/db";
import { companyInvites } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { eq } from "drizzle-orm";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { VerificationModal } from "./_components/verification-modal";
import React from "react";

const AcceptInvitePage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const [showVerification, setShowVerification] = React.useState(false);

  const getInvite = api.invite.getInvite.useQuery({
    inviteId: id ?? "",
  });

  const { mutate: declineInvite } = api.invite.declineInvite.useMutation({
    onSuccess: () => {
      toast({
        title: "Invite Declined",
      });
    },
  });

  console.log({ getInvite });

  const handleAccept = () => {
    setShowVerification(true);
  };

  const handleDecline = () => {
    toast({
      title: "Invite Declined",
      description: "You have declined the invitation",
      variant: "destructive",
    });
    declineInvite({ inviteId: id ?? "" });
    router.push("/signup");
  };

  if (getInvite.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!getInvite.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader className="text-center text-xl text-red-500">
            Invite Not Found
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              The invitation you&apos;re looking for doesn&apos;t exist or has
              expired.
            </p>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-[#2595BE] hover:underline"
              >
                Sign in here
              </button>
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              Return Home
            </Button>
            <Button onClick={() => router.push("/signup")}>
              Create Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="mb-8 text-center text-2xl font-bold sm:mb-10 sm:text-3xl">
        Fund<span className="text-[#2595BE]">Pitch</span>
      </h1>
      {!showVerification ? (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Company Invitation</h2>
            <p className="text-gray-600">
              You&apos;ve been invited to join as a {getInvite?.data?.role}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="relative h-32 w-32">
                <Image
                  src={
                    getInvite.data?.photo ?? "/assets/images/companylogo.png"
                  }
                  alt="Company Logo"
                  fill
                  className="rounded-full bg-gray-100 object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold">
                  {getInvite.data.companyName}
                </h3>
                <p className="mb-4 text-gray-600">{getInvite.data.about}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleDecline}>
              Decline
            </Button>
            <Button onClick={handleAccept}>Accept Invitation</Button>
          </CardFooter>
        </Card>
      ) : (
        <VerificationModal
          id={id}
          email={getInvite.data?.email ?? ""}
          phoneNumber={getInvite.data?.phone ?? ""}
          role={getInvite.data?.role ?? ""}
        />
      )}
    </div>
  );
};

export default AcceptInvitePage;
