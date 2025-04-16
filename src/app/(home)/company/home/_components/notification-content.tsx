"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationContent = () => {
  const router = useRouter();
  const {
    data,
    isLoading,
    refetch: getRefetch,
  } = api.companyNotification.getInviteHistory.useQuery();

  const {
    data: count,
    isLoading: countLoading,
    refetch: countRefetch,
  } = api.companyNotification.getInviteHistoryCount.useQuery();

  const { mutate: acceptInvite } = api.company.acceptInvite.useMutation({
    onSuccess: () => {
      void countRefetch();
      void getRefetch();
    },
  });

  const handleAccept = (id: string) => {
    console.log(id);
    acceptInvite({
      inviteId: id,
    });
  };

  const { mutate: declineInvite } = api.company.declineInvite.useMutation({
    onSuccess: () => {
      void countRefetch();
      void getRefetch();
    },
  });

  const handleDecline = (id: string) => {
    console.log(id);
    declineInvite({
      inviteId: id,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <div className="mx-auto w-full max-w-[800px] space-y-2 p-2 sm:space-y-4 sm:p-4">
      <div className="mb-3 flex items-center justify-between sm:mb-6">
        <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
          Notifications
        </h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All
          </TabsTrigger>
          <TabsTrigger value="request" className="relative text-xs sm:text-sm">
            Request History
            {!countLoading && count !== undefined && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-5 sm:w-5">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="all"
          className="mt-2 max-h-[60vh] space-y-2 overflow-y-auto sm:mt-4 sm:max-h-[70vh] sm:space-y-4 md:max-h-[80vh]"
        >
          {data?.map((invite) => (
            <Card key={invite.id} className="w-full">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start gap-2 sm:gap-4">
                  <Avatar className="h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10 md:h-12 md:w-12">
                    <AvatarImage
                      src={
                        invite.individualPhoto ?? "/assets/images/profile.png"
                      }
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-gray-100">
                      {(
                        invite.email?.[0] ??
                        invite.phoneNumber?.[0] ??
                        ""
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1 sm:gap-2">
                      <p className="truncate text-sm font-medium sm:text-base">
                        {invite.email ?? invite.phoneNumber}
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {invite.status === "accepted" &&
                          !invite.isUserApproved && (
                            <div className="relative">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                    >
                                      <circle cx="8" cy="8" r="1" />
                                      <circle cx="4" cy="8" r="1" />
                                      <circle cx="12" cy="8" r="1" />
                                    </svg>
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="text-xs sm:text-sm"
                                >
                                  <DropdownMenuItem
                                    onClick={() => {
                                      router.push(
                                        `/individual-overview/home?id=${invite.id}`,
                                      );
                                    }}
                                  >
                                    View Profile
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                      </div>
                    </div>

                    <p className="mb-2 text-xs text-gray-500 sm:mb-4 sm:text-sm">
                      {getStatusMessage(invite.status)}
                    </p>

                    <span className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      {invite.updatedAt
                        ? formatDistanceToNow(
                            new Date(invite.updatedAt ?? ""),
                            {
                              addSuffix: true,
                            },
                          )
                        : "now"}
                    </span>

                    {invite.status === "accepted" && !invite.isUserApproved && (
                      <div className="mt-2 flex gap-2 sm:mt-4 sm:gap-3">
                        <Button
                          className="h-auto flex-1 bg-blue-600 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
                          variant="default"
                          onClick={() => handleAccept(invite.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="h-auto flex-1 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
                          variant="destructive"
                          onClick={() => handleDecline(invite.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent
          value="request"
          className="mt-2 max-h-[60vh] space-y-2 overflow-y-auto sm:mt-4 sm:max-h-[70vh] sm:space-y-4 md:max-h-[80vh]"
        >
          {data
            ?.filter(
              (invite) =>
                invite.status === "accepted" && !invite.isUserApproved,
            )
            .map((invite) => (
              <Card key={invite.id} className="w-full">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 sm:h-10 sm:w-10 md:h-12 md:w-12" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1 sm:gap-2">
                        <p className="truncate text-sm font-medium sm:text-base">
                          {invite.email ?? invite.phoneNumber}
                        </p>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="relative">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                  >
                                    <circle cx="8" cy="8" r="1" />
                                    <circle cx="4" cy="8" r="1" />
                                    <circle cx="12" cy="8" r="1" />
                                  </svg>
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="text-xs sm:text-sm"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/individual-overview?id=${invite.individualId}`,
                                    )
                                  }
                                >
                                  View Profile
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      <p className="mb-2 text-xs text-gray-500 sm:mb-4 sm:text-sm">
                        {getStatusMessage(invite.status)}
                      </p>

                      <span className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {invite.updatedAt
                          ? formatDistanceToNow(
                              new Date(invite.updatedAt ?? ""),
                              {
                                addSuffix: true,
                              },
                            )
                          : "now"}
                      </span>

                      <div className="mt-2 flex gap-2 sm:mt-4 sm:gap-3">
                        <Button
                          className="h-auto flex-1 bg-blue-600 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
                          variant="default"
                          onClick={() => handleAccept(invite.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="h-auto flex-1 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
                          variant="destructive"
                          onClick={() => handleDecline(invite.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case "sent":
      return "Invite has been successfully sent";
    case "declined":
      return "Declined your request";
    case "accepted":
      return "Accepted your invitation";
    default:
      return "";
  }
};

export default NotificationContent;
