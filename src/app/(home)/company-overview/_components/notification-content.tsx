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

const NotificationContent = () => {
  const { data, isLoading } =
    api.companyNotification.getInviteHistory.useQuery();

  const { data: count, isLoading: countLoading } =
    api.companyNotification.getInviteHistoryCount.useQuery();

  const handleAccept = (id: string) => {
    console.log(id);
  };

  const handleDecline = (id: string) => {
    console.log(id);
  };

  return (
    <div className="mx-auto max-w-[800px] space-y-4 p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="request" className="relative">
            Request History
            {!countLoading && count !== undefined && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="all"
          className="mt-4 max-h-[80vh] space-y-4 overflow-y-auto"
        >
          {data?.map((invite) => (
            <Card key={invite.id} className="w-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-medium">
                        {invite.email ?? invite.phoneNumber}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {invite.updatedAt
                            ? formatDistanceToNow(
                                new Date(invite.updatedAt ?? ""),
                                {
                                  addSuffix: true,
                                },
                              )
                            : "now"}
                        </span>
                        {invite.status === "accepted" &&
                          !invite.isUserApproved && (
                            <div className="relative">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
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
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      console.log(
                                        "View profile for",
                                        invite.id,
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

                    <p className="mb-4 text-sm text-gray-500">
                      {getStatusMessage(invite.status)}
                    </p>

                    {invite.status === "accepted" && !invite.isUserApproved && (
                      <div className="mt-4 flex gap-3">
                        <Button
                          className="flex-1 bg-blue-600"
                          variant="default"
                          onClick={() => handleAccept(invite.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="flex-1"
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

        <TabsContent value="request">
          {data
            ?.filter(
              (invite) =>
                invite.status === "accepted" && !invite.isUserApproved,
            )
            .map((invite) => (
              <Card key={invite.id} className="w-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-medium">
                          {invite.email ?? invite.phoneNumber}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {invite.updatedAt
                              ? formatDistanceToNow(
                                  new Date(invite.updatedAt ?? ""),
                                  {
                                    addSuffix: true,
                                  },
                                )
                              : "now"}
                          </span>
                          <div className="relative">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
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
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    console.log("View profile for", invite.id)
                                  }
                                >
                                  View Profile
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      <p className="mb-4 text-sm text-gray-500">
                        {getStatusMessage(invite.status)}
                      </p>

                      <div className="mt-4 flex gap-3">
                        <Button
                          className="flex-1 bg-blue-600"
                          variant="default"
                          onClick={() => handleAccept(invite.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="flex-1"
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
