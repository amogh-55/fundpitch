"use client";
import React from "react";
import { Delete, Edit3, ImagePlusIcon, Trash2Icon } from "lucide-react";
import { api, RouterOutputs } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import UploadButton from "@/app/(home)/_components/UploadButton";

interface Photoform {
  photo: string;
}

const UserTopBar = ({ users }: { users: RouterOutputs["user"]["getUser"] }) => {
  const { data: profilePhoto, refetch } =
    api.individual.getProfilePhoto.useQuery();

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
        void refetch();
      },
      onError: (error) => {
        toast({
          description: error.message,
        });
      },
    });

  const { mutateAsync: removerProfilePic } =
    api.individual.updateProfilePhoto.useMutation({
      onSuccess: () => {
        toast({
          description: "Photo removed",
        });
        void refetch();
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

  const handleEditPhoto = async (photo: string) => {
    try {
      await removerProfilePic({
        photo,
      });
      setValue("photo", "");
    } catch (error) {
      console.error("Error removing photo:", error);
    }
  };

  return (
    <div className="relative mb-28 flex h-28 w-full items-center justify-start rounded-t-xl bg-gradient-to-r from-[#40C3F34D] from-30% via-[#9FE1F966] via-40% to-[#40C3F3B2] to-70%">
      <div className="relative left-6 top-4 flex flex-row gap-3 md:left-12 md:top-10 md:flex-row">
        <div className="flex flex-row items-center justify-center">
          <p className="mt-6 flex justify-center text-xs text-red-500">
            {errors.photo?.message}
          </p>
          <label
            htmlFor="file-upload"
            className="relative top-6 flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600 bg-gray-200 md:h-36 md:w-36"
          >
            {profilePhoto?.photo ? (
              <div className="group relative h-full w-full">
                <img
                  src={profilePhoto?.photo ?? "/assets/images/companylogo.png"}
                  alt="Uploaded"
                  className="relative h-full w-full rounded-xl object-cover"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleEditPhoto("")}
                >
                  <ImagePlusIcon size={38} className="text-white" />
                </div>
              </div>
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
          <>
            {profilePhoto?.photo && (
              <button
                className="group absolute left-20 rounded-full border border-gray-600 bg-white p-2 text-xs font-medium text-[#083A50] hover:bg-[#9fe1f9] md:left-32 md:text-sm"
                onClick={() => handleEditPhoto("")}
              >
                <Edit3 size={12} />
                <div className="pointer-events-none absolute bottom-full left-20 z-10 mb-2 w-40 -translate-x-1/2 transform rounded-md bg-black bg-opacity-70 px-3 py-1 text-xs text-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100">
                  <p className="text-xs"> Edit Profile Picture</p>
                </div>
              </button>
            )}
          </>
        </div>
        <div className="relative top-3 flex flex-col flex-nowrap justify-end gap-1">
          <div className="md: text-sm font-medium text-[#083A50] md:top-20 md:text-lg">
            {users?.phone ? `+91 ${users?.phone}` : <div>...Loading</div>}
          </div>
          <div className="md: md: text-xs font-medium text-[#083A50] md:text-sm">
            {users?.email ?? <div>...Loading</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTopBar;
