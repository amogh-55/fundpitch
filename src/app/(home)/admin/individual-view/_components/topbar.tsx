"use client";
import React from "react";
import { Delete, ImagePlusIcon, Trash2Icon } from "lucide-react";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import UploadButton from "@/app/(home)/_components/UploadButton";

interface Photoform {
  photo: string;
}

const UserTopBar = () => {
  const { data: user, isLoading, isPending } = api.user.getUser.useQuery();

  if (isLoading) {
    <div>Loading...</div>;
  }

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<Photoform>();

  const { mutateAsync: updateProfilePic } =
    api.individual.updateProfilePhoto.useMutation({
      onSuccess: () => {
        toast({
          description: "Photo uploaded",
        });
      },
      onError: (error) => {
        toast({
          description: error.message,
        });
      },
    });

  const handleUploadPhoto = async (photo: string) => {
    try {
      await updateProfilePic({
        photo,
      });
      setValue("photo", photo);
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div className="relative mb-28 flex h-28 w-full items-center justify-start rounded-t-xl bg-gradient-to-r from-[#40C3F34D] from-30% via-[#9FE1F966] via-40% to-[#40C3F3B2] to-70%">
      <div className="relative left-6 top-4 flex flex-row md:left-12 md:top-10 md:flex-row">
        <div className="flex flex-col">
          <p className="mt-6 flex justify-center text-xs text-red-500">
            {errors.photo?.message}
          </p>
          <label
            htmlFor="file-upload"
            className="relative top-6 flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600 bg-gray-200 md:h-36 md:w-36"
          >
            {watch("photo") ? (
              <img
                src={watch("photo")}
                alt="Uploaded"
                className="relative h-full w-full rounded-xl object-cover"
              />
            ) : (
              <UploadButton
                {...register("photo", {
                  required: "Image is required",
                })}
                folderName="profile"
                callback={async (url) => {
                  void handleUploadPhoto(url);
                }}
                accept="image/*"
                className=""
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ImagePlusIcon size={38} className="mb-3 text-gray-400" />
                  <div className="text-xs text-gray-700">Upload your photo</div>
                </div>
              </UploadButton>
            )}
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative left-4 top-20 text-xs font-medium text-[#083A50] md:left-4 md:top-28 md:text-sm">
            {isLoading ? <div>...Loading</div> : user?.email}
          </div>
          <div className="relative left-4 top-20 text-xs font-medium text-[#083A50] md:left-4 md:top-28 md:text-sm">
            {isLoading ? <div>...Loading</div> : user?.phone}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTopBar;
