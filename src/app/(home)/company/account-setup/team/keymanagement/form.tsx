"use client";

import UploadButton from "@/app/(home)/_components/UploadButton";
import { toast } from "@/components/ui/use-toast";
import { api, RouterOutputs } from "@/trpc/react";
import { ChevronsRight, ImagePlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { TrashIcon } from "lucide-react";
import useDelete from "@/hooks/useDelete";

interface Member {
  photo: string;
  nameOfTheMember: string;
  role: string;
  teamStrength: string;
}

interface formData {
  members: Member[];
}

const KeyManagementForm = ({
  keyManagament,
  revalidateRoute,
}: {
  keyManagament: RouterOutputs["company"]["getKeyManagament"];
  revalidateRoute: () => Promise<void>;
}) => {
  const router = useRouter();

  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    defaultValues: {
      members: keyManagament.map((member) => ({
        photo: member.photo ?? "",
        nameOfTheMember: member.nameOfTheMember ?? "",
        role: member.role ?? "",
        teamStrength: member.teamStrength ?? "",
      })),
    },
  });

  const { handleDelete } = useDelete({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const { mutate } = api.company.addKeyManagament.useMutation({
    onSuccess: () => {
      toast({
        description: "Added sucessfully",
      });
      void revalidateRoute();
      router.push("/company/account-setup/business-verticals");
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
    },
  });

  const { mutate: deleteManager } = api.company.deleteKeyManager.useMutation({
    onSuccess: () => {
      toast({
        description: "Deleted successfully",
      });
      void revalidateRoute();
    },
  });

  const { mutate: updateKeyManagerPhoto } =
    api.company.updateKeyManagerPhoto.useMutation({
      onSuccess: () => {
        toast({
          description: "Updated successfully",
        });
      },
    });
  const onSubmit = (_data: formData) => {
    const members = getValues("members");

    // if (members.length === 0) {
    //   toast({
    //     description: "Please fill the details",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    const existingIds = new Set(
      keyManagament.map((member) => member.nameOfTheMember),
    );

    members.forEach((member) => {
      if (!existingIds.has(member.nameOfTheMember)) {
        mutate({
          photo: member.photo,
          nameOfTheMember: member.nameOfTheMember,
          role: member.role,
          teamStrength: member.teamStrength,
        });
      }
    });

    router.push("/company/account-setup/business-verticals");
  };

  const handleDeletePhoto = async (index: number, photo: string) => {
    if (photo) {
      await handleDelete(photo);
      setValue(`members.${index}.photo`, "");

      const member = keyManagament[index];
      if (member?.id) {
        updateKeyManagerPhoto({ id: member.id, photo: null });
      }
    }
  };

  const handleRemoveRow = async (index: number) => {
    const member = keyManagament[index];

    // Delete photo if exists
    const photo = watch(`members.${index}.photo`);
    if (photo) {
      await handleDelete(photo);
    }

    // Delete from database if exists
    if (member?.id) {
      deleteManager({ id: member.id });
    }

    // Remove from form
    remove(index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-xs sm:text-sm">
      {fields.map((member, index) => (
        <div
          key={member.id}
          className="mb-6 flex w-full flex-col justify-center gap-4 lg:flex-row"
        >
          <div className="flex w-full flex-col items-center lg:w-[15%] lg:items-start">
            <div className="group relative">
              <label
                htmlFor={`file-upload-${index}`}
                className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600 bg-gray-200 sm:h-24 sm:w-24 md:h-28 md:w-28"
              >
                {watch(`members.${index}.photo`) ? (
                  <>
                    <img
                      src={watch(`members.${index}.photo`)}
                      alt="Uploaded"
                      className="h-full w-full rounded-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          void handleDeletePhoto(
                            index,
                            watch(`members.${index}.photo`),
                          );
                        }}
                        className="transform rounded-full bg-red-500 p-2 text-white transition-transform hover:scale-110 hover:bg-red-600"
                      >
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <UploadButton
                    {...register(`members.${index}.photo`, {
                      required: "Image is required",
                    })}
                    folderName="profile"
                    callback={async (url) => {
                      setValue(`members.${index}.photo`, url);
                      clearErrors(`members.${index}.photo`);
                    }}
                    accept="image/*"
                    className=""
                  >
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ImagePlusIcon
                        size={30}
                        className="mb-2 text-gray-400 sm:mb-3"
                      />
                      <div className="text-xs text-gray-700">
                        Upload your photo
                      </div>
                    </div>
                  </UploadButton>
                )}
              </label>
              {errors.members?.[index]?.photo && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.members?.[index]?.photo.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col items-center justify-between gap-4 rounded-xl shadow-xl shadow-[#3877C20D] lg:mt-0 lg:w-[85%] lg:flex-row">
            <div className="w-full text-slate-600 lg:w-[45%]">
              Name of the Member
              <div>
                <input
                  type="text"
                  placeholder="Enter Name"
                  {...register(`members.${index}.nameOfTheMember`, {
                    required: "Name of the Member is required",
                  })}
                  className="w-full rounded-md border-2 border-gray-200 p-1.5 text-gray-600 sm:p-2"
                />
              </div>
              {errors.members?.[index]?.nameOfTheMember && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.members?.[index]?.nameOfTheMember.message}
                </p>
              )}
            </div>
            <div className="w-full text-slate-600 lg:w-[20%]">
              Role
              <div>
                <input
                  type="text"
                  placeholder="Enter Role"
                  {...register(`members.${index}.role`, {
                    required: "Role is required",
                  })}
                  className="w-full rounded-md border-2 border-gray-200 p-1.5 text-gray-600 sm:p-2"
                />
              </div>
              {errors.members?.[index]?.role && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.members?.[index]?.role.message}
                </p>
              )}
            </div>
            <div className="w-full text-slate-600 lg:w-[20%]">
              Team Strength
              <div>
                <input
                  type="text"
                  placeholder="Enter Value"
                  {...register(`members.${index}.teamStrength`, {
                    required: "Team Strength is required",
                  })}
                  onKeyPress={(e) => {
                    if (/[^0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full rounded-md border-2 border-gray-200 p-1.5 text-gray-600 sm:p-2"
                />
              </div>
              {errors.members?.[index]?.teamStrength && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.members?.[index]?.teamStrength.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="relative flex w-5/6 flex-wrap items-end justify-end gap-2 rounded-lg sm:gap-4 lg:left-28">
        {fields.map((field, index) => (
          <button
            key={field.id}
            type="button"
            onClick={() => handleRemoveRow(index)}
            className="flex flex-row items-center justify-center gap-1 rounded-xl bg-red-50 p-2 text-xs text-red-600 shadow-xl shadow-[#3877C20D] hover:bg-red-100 sm:gap-2 sm:p-3 sm:text-sm"
          >
            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Remove {index + 1}
          </button>
        ))}

        <button
          className="flex flex-row items-center justify-center gap-1 rounded-xl bg-white p-2 text-xs text-gray-400 shadow-xl shadow-[#3877C20D] sm:gap-2 sm:p-3 sm:text-sm"
          type="button"
          disabled={fields.length >= 5}
          onClick={() =>
            append({
              role: "",
              nameOfTheMember: "",
              photo: "",
              teamStrength: "",
            })
          }
        >
          <img
            src="/assets/images/Group 47748 (1).png"
            alt=""
            className="h-5 w-5 sm:h-6 sm:w-6"
          />{" "}
          Add Member
        </button>
      </div>

      <div className="relative mt-6 flex w-5/6 items-end justify-end rounded-lg lg:left-28">
        <button
          type="submit"
          className="flex flex-row items-center justify-center rounded-xl bg-[#007AFF] px-2 py-1.5 text-xs text-white hover:bg-[#007bffd0] sm:px-3 sm:py-2 sm:text-sm"
        >
          Next Step <ChevronsRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </form>
  );
};

export default KeyManagementForm;
