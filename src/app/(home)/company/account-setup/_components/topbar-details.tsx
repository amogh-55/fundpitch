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

  const { data: profilePhoto, refetch } =
    api.company.getCompanyPhoto.useQuery();

  const { mutateAsync: updateProfilePic } =
    api.company.updateCompanyPhoto.useMutation({
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
    api.company.updateCompanyPhoto.useMutation({
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
    <div className="relative mb-16 flex h-20 w-full items-center justify-start rounded-t-xl bg-gradient-to-r from-[#40C3F34D] from-30% via-[#9FE1F966] via-40% to-[#40C3F3B2] to-70% sm:mb-20 sm:h-24 md:mb-28 md:h-28">
      <div className="relative left-4 top-2 flex flex-row gap-2 sm:left-6 sm:top-3 sm:gap-3 md:left-12 md:top-10 md:flex-row">
        <div className="flex flex-row items-center justify-center">
          <p className="mt-6 flex justify-center text-xs text-red-500">
            {errors.photo?.message}
          </p>
          <label
            htmlFor="file-upload"
            className="relative top-4 flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600 bg-gray-200 sm:top-5 sm:h-24 sm:w-24 md:top-6 md:h-24 md:w-24 lg:h-36 lg:w-36"
          >
            {profilePhoto?.photo ? (
              <img
                src={profilePhoto?.photo ?? "/assets/images/companylogo.png"}
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
                  <ImagePlusIcon
                    size={24}
                    className="mb-1 text-gray-400 sm:mb-2 md:mb-3"
                  />
                  <div className="text-[10px] text-gray-700 sm:text-xs">
                    Upload photo
                  </div>
                </div>
              </UploadButton>
            )}
          </label>
          <>
            {profilePhoto?.photo && (
              <button
                className="sm:left-18 group absolute left-14 rounded-full border border-gray-600 bg-white p-1 text-[10px] font-medium text-[#083A50] hover:bg-[#9fe1f9] sm:p-2 sm:text-xs md:left-20 md:text-sm lg:left-32"
                onClick={() => handleEditPhoto("")}
              >
                <Edit3 size={12} />
                <div className="pointer-events-none absolute bottom-full left-10 z-10 mb-2 w-32 -translate-x-1/2 transform rounded-md bg-black bg-opacity-70 px-2 py-1 text-[10px] text-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 sm:left-20 sm:w-40 sm:px-3 sm:text-xs">
                  <p className="text-[10px] sm:text-xs">
                    {" "}
                    Edit Profile Picture
                  </p>
                </div>
              </button>
            )}
          </>
        </div>
        <div className="relative top-3 flex flex-col flex-nowrap justify-end gap-1">
          <div className="mt-2 text-xs font-medium text-[#083A50] md:top-20 md:text-lg">
            {profilePhoto?.name ?? ""}
          </div>

          <div className="md: text-xs font-medium text-[#083A50] md:top-20 md:text-xs">
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
