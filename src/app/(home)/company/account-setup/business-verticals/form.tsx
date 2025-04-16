"use client";

import UploadButton from "@/app/(home)/_components/UploadButton";
import { toast } from "@/components/ui/use-toast";
import { api, RouterOutputs } from "@/trpc/react";
import { ChevronsRight, ImagePlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import useDelete from "@/hooks/useDelete";
import { useForm, useFieldArray } from "react-hook-form";

interface Member {
  photo: string;
  nameOfTheBusinessVertical: string;
  about: string;
}

interface BusinessVertical {
  members: Member[];
}

const BusinessVerticalForm = ({
  businessVertical,
  revalidateRoute,
}: {
  businessVertical: RouterOutputs["company"]["getBusinessVertical"];
  revalidateRoute: () => Promise<void>;
}) => {
  const router = useRouter();

  const { handleDelete } = useDelete({});

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<BusinessVertical>({
    defaultValues: {
      members: businessVertical.map((member) => ({
        photo: member.photo ?? "",
        nameOfTheBusinessVertical: member.nameOfTheBusinessVertical ?? "",
        about: member.about ?? "",
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const { mutate } = api.company.addBusinessVertical.useMutation({
    onSuccess: () => {
      toast({
        description: "Added sucessfully",
      });
      router.push("/company/account-setup/documents/corporate-decks");
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
    },
  });

  const { mutate: updateBusinessVerticalPhoto } =
    api.company.updateBusinessVerticalPhoto.useMutation({
      onSuccess: () => {
        toast({
          description: "Updated successfully",
        });
      },
    });
  const { mutate: deleteVertical } =
    api.company.deleteBusinessVertical.useMutation({
      onSuccess: () => {
        toast({
          description: "Deleted successfully",
        });
        void revalidateRoute();
      },
      onError: (error) => {
        toast({
          description: error.message,
        });
      },
    });

  const handleDeletePhoto = async (index: number, photo: string) => {
    if (photo) {
      await handleDelete(photo);
      setValue(`members.${index}.photo`, "");

      const member = businessVertical[index];
      if (member?.id) {
        updateBusinessVerticalPhoto({ id: member.id, photo: null });
      }
    }
  };

  const handleRemoveRow = async (index: number) => {
    const member = businessVertical[index];

    // If there's a photo, delete it from storage
    const photo = watch(`members.${index}.photo`);
    if (photo) {
      await handleDelete(photo);
    }

    // If it exists in database, delete it
    if (member?.id) {
      deleteVertical({ id: member.id });
    }

    // Remove from form
    remove(index);
  };

  const onSubmit = (_data: BusinessVertical) => {
    const members = getValues("members");

    // if (members.length === 0) {
    //   toast({
    //     description: "Please fill the details",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    const existingIds = new Set(
      businessVertical.map((vertical) => vertical.nameOfTheBusinessVertical),
    );

    members.forEach((member) => {
      if (!existingIds.has(member.nameOfTheBusinessVertical)) {
        mutate({
          about: member.about,
          photo: member.photo,
          nameOfTheBusinessVertical: member.nameOfTheBusinessVertical,
        });
      }
    });

    router.push("/company/account-setup/documents/corporate-decks");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-full px-4 pb-5 text-sm"
    >
      <div className="mb-8">
        {fields.map((member, index) => (
          <div
            key={member.id}
            className="mb-10 flex w-full flex-col items-center gap-2 px-4 sm:px-6 md:relative md:left-10 md:flex-row md:gap-10"
          >
            <div className="flex w-full flex-col items-center md:w-[25%] md:items-start">
              <div className="relative w-full max-w-xs">
                <label
                  htmlFor={`file-upload-${index}`}
                  className="flex h-48 w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-gray-200"
                >
                  {watch(`members.${index}.photo`) ? (
                    <>
                      <img
                        src={watch(`members.${index}.photo`)}
                        alt="Uploaded"
                        className="h-full w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          void handleDeletePhoto(
                            index,
                            watch(`members.${index}.photo`),
                          );
                        }}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
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
                      className="h-full w-full"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <ImagePlusIcon
                          size={38}
                          className="mb-3 text-gray-400"
                        />
                        <p className="text-sm text-gray-700">Upload photo</p>
                      </div>
                    </UploadButton>
                  )}
                </label>
              </div>
              {errors.members?.[index]?.photo && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.members?.[index]?.photo.message}
                </p>
              )}
            </div>

            <div className="mt-6 flex w-full flex-col md:mt-0">
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Name of the Business Vertical
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  {...register(`members.${index}.nameOfTheBusinessVertical`, {
                    required: "Name is required",
                  })}
                  className="w-full rounded-md border-2 border-gray-200 p-2 text-sm text-gray-600"
                />
                {errors.members?.[index]?.nameOfTheBusinessVertical && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.members?.[index]?.nameOfTheBusinessVertical.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  About
                </label>
                <textarea
                  placeholder="Enter text (max 50 words)"
                  {...register(`members.${index}.about`, {
                    required: "About is required",
                  })}
                  className="h-28 w-full rounded-md border-2 border-gray-200 p-2 text-sm text-gray-600"
                />
                {errors.members?.[index]?.about && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.members?.[index]?.about.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-wrap justify-center gap-3 px-4 sm:px-6 md:justify-end md:gap-4 md:pr-12 lg:pr-16">
        {fields.map((field, index) => (
          <button
            key={field.id}
            type="button"
            onClick={() => handleRemoveRow(index)}
            className="flex flex-row items-center justify-center gap-2 rounded-xl bg-red-50 p-2 text-xs text-red-600 shadow-xl shadow-[#3877C20D] hover:bg-red-100 sm:p-3 sm:text-sm"
          >
            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Remove {index + 1}
          </button>
        ))}

        <button
          className="flex flex-row items-center justify-center gap-2 rounded-xl bg-white p-2 text-xs text-gray-400 shadow-xl shadow-[#3877C20D] sm:p-3 sm:text-sm"
          type="button"
          disabled={fields.length >= 5}
          onClick={() =>
            append({
              nameOfTheBusinessVertical: "",
              photo: "",
              about: "",
            })
          }
        >
          <img
            src="/assets/images/Group 47748 (1).png"
            alt=""
            className="h-5 w-5 sm:h-6 sm:w-6"
          />
          Add Vertical
        </button>
      </div>

      <div className="mt-6 flex w-full justify-center px-4 sm:px-6 md:justify-end md:pr-12 lg:pr-16">
        <button
          type="submit"
          className="flex flex-row items-center justify-center rounded-xl bg-[#007AFF] px-3 py-2 text-white hover:bg-[#007bffd0]"
        >
          Next Step <ChevronsRight className="ml-1" />
        </button>
      </div>
    </form>
  );
};

export default BusinessVerticalForm;
