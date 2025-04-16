"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { PencilIcon, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface form {
  aboutTeam: string;
}

const TeamContent = () => {
  const [activeTab, setActiveTab] = useState("Key Management Team");

  const { data: keyManagament } = api.company.getTeamKeyManagament.useQuery();
  const { data: boardOfDirectors } =
    api.company.getTeamBoardOfDirectors.useQuery();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<form>();

  const { data: homeDetails, isLoading } = api.company.getAboutTeam.useQuery();

  const queryClient = useQueryClient();

  const aboutTeamQuery = getQueryKey(
    api.company.getAboutTeam,
    undefined,
    "query",
  );

  const { mutate } = api.company.updateCompanyAboutTeam.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: aboutTeamQuery,
      });
      setIsOpen(false);
      toast({
        description: "Details filled",
      });
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
    },
  });

  const onSubmit = (data: form) => {
    const requiredFields = watch("aboutTeam");

    if (!requiredFields) {
      toast({
        description: "Please add",
      });
    } else {
      mutate(data);
    }
  };

  if (isLoading) {
    return <div>...Loading</div>;
  }

  return (
    <div className="grid h-[calc(100vh-12rem)] w-full md:grid-cols-[30%_70%]">
      <Card className="relative h-full rounded-t-[46px] bg-white">
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
          <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4">
            <h2 className="relative bottom-5 left-10 flex font-normal text-white">
              About Team{" "}
              <DialogTrigger>
                <PencilIcon
                  height={16}
                  className="ml-2 cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>About Team</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6 mt-4">
                    {errors.aboutTeam && (
                      <p className="text-sm text-red-400">
                        {errors.aboutTeam.message}
                      </p>
                    )}
                    <textarea
                      {...register("aboutTeam", { required: "Add few words" })}
                      className="h-36 w-full border-2 border-gray-300 text-sm text-gray-600 md:text-base"
                    />
                    <Button type="submit" className="bg-primaryBlue">
                      Submit
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </h2>
          </div>

          <div className="absolute top-14 h-[calc(100%-3.5rem)] w-full overflow-y-auto rounded-t-[45px] bg-white p-14 pt-8">
            {homeDetails &&
              <p className="text-sm text-gray-600 md:text-base">
                {homeDetails?.aboutTeam ?? "No description yet."}
              </p>
            }
          </div>
        </Dialog>
      </Card>

      <Card className="relative h-full rounded-t-[46px] bg-white">
        <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#f7f8fc] px-4">
          <h2 className="relative bottom-5 left-10 flex font-normal text-white">
            <div className="flex space-x-4">
              <button
                className={`rounded-full px-4 py-2 text-sm ${activeTab === "Key Management Team"
                  ? "bg-[#E0EDFF] text-[#2388FF]"
                  : "bg-white text-black"
                  }`}
                onClick={() => handleTabChange("Key Management Team")}
              >
                Key Management Team
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm ${activeTab === "Board of Directors"
                  ? "bg-[#E0EDFF] text-[#2388FF]"
                  : "bg-white text-black"
                  }`}
                onClick={() => handleTabChange("Board of Directors")}
              >
                Board of Directors
              </button>
            </div>
          </h2>
        </div>

        <div className="absolute top-14 h-[calc(100%-3.5rem)] w-full overflow-y-auto rounded-t-[45px] bg-white p-14 pt-8">
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {activeTab === "Key Management Team" &&
              keyManagament?.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center rounded-2xl bg-[#F6F8FC] p-4"
                >
                  <img
                    src={member.photo ?? ""}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="font-semibold">{member.nameOfTheMember}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              ))}

            {activeTab === "Board of Directors" &&
              boardOfDirectors?.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center rounded-2xl bg-[#F6F8FC] p-4"
                >
                  <img
                    src={member.photo ?? ""}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="font-semibold">{member.nameOfTheMember}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamContent;
