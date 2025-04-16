"use client";
import { ImagePlusIcon, TrashIcon } from "lucide-react";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ChevronsRight } from "lucide-react";
import { api, RouterOutputs } from "@/trpc/react";
import useDelete from "@/hooks/useDelete";
import { toast } from "@/components/ui/use-toast";
import UploadButton from "@/app/(home)/_components/UploadButton";
import { useRouter } from "next/navigation";

interface Member {
  photo: string;
  nameOfTheMember: string;
  role: string;
}

interface BoardOfDirectorForm {
  members: Member[];
}

const BoardOfDirectorForm = ({
  boardOfDirectors,
  revalidateRoute,
}: {
  boardOfDirectors: RouterOutputs["company"]["getBoardOfDirectors"];
  revalidateRoute: () => Promise<void>;
}) => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm<BoardOfDirectorForm>({
    defaultValues: {
      members: boardOfDirectors.map((member) => ({
        photo: member.photo ?? "",
        nameOfTheMember: member.nameOfTheMember ?? "",
        role: member.role ?? "",
      })),
    },
  });

  const { handleDelete } = useDelete({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const { mutate } = api.company.addBoardOfDirectors.useMutation({
    onSuccess: () => {
      toast({
        description: "Added sucessfully",
      });
      void revalidateRoute();
      router.push("/company/account-setup/team/keymanagement");
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
    },
  });

  const { mutate: deleteDirector } =
    api.company.deleteBoardOfDirector.useMutation({
      onSuccess: () => {
        toast({
          description: "Deleted successfully",
        });
        void revalidateRoute();
      },
    });

  const { mutate: updateBoardDirectorPhoto } =
    api.company.updateBoardDirectorPhoto.useMutation({
      onSuccess: () => {
        toast({
          description: "Updated successfully",
        });
      },
    });
  const handleDeletePhoto = async (index: number, photo: string) => {
    if (photo) {
      await handleDelete(photo);
      setValue(`members.${index}.photo`, "");

      const member = boardOfDirectors[index];
      if (member?.id) {
        updateBoardDirectorPhoto({ id: member.id, photo: null });
      }
    }
  };

  const handleRemoveRow = async (index: number) => {
    const member = boardOfDirectors[index];

    // Delete photo if exists
    const photo = watch(`members.${index}.photo`);
    if (photo) {
      await handleDelete(photo);
    }

    // Delete from database if exists
    if (member?.id) {
      deleteDirector({ id: member.id });
    }

    // Remove from form
    remove(index);
  };

  const onSubmit = (_data: BoardOfDirectorForm) => {
    const members = getValues("members");

    // if (members.length === 0) {
    //   toast({
    //     description: "Please fill the details",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    const existingIds = new Set(
      boardOfDirectors.map((member) => member.nameOfTheMember),
    );

    members.forEach((member) => {
      if (!existingIds.has(member.nameOfTheMember)) {
        mutate({
          photo: member.photo,
          nameOfTheMember: member.nameOfTheMember,
          role: member.role,
        });
      }
    });

    router.push("/company/account-setup/team/keymanagement");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-5">
      {fields.map((member, index) => (
        <div
          key={member.id}
          className="relative mb-4 sm:mb-6 flex w-full flex-col items-center justify-center text-xs sm:text-sm lg:flex-row p-2 sm:p-3"
        >
          <div className="flex w-full flex-col justify-center lg:w-[15%] lg:justify-start">
            <div className="group relative">
              <label
                htmlFor={`file-upload-${index}`}
                className="relative flex h-24 w-24 sm:h-24 sm:w-24 md:h-28 md:w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600 bg-gray-200 mx-auto lg:mx-0"
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
                        <TrashIcon className="h-5 w-5" />
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
                      clearErrors(`members.${index}.photo`)
                    }}
                    accept="image/*"
                    className=""
                  >
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ImagePlusIcon size={38} className="mb-3 text-gray-400" />
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

          <div className="m-5 flex w-full flex-col items-center justify-between gap-4 rounded-xl p-5 shadow-xl shadow-[#3877C20D] md:w-[85%] md:flex-row">
            <div className="w-full text-slate-600 md:w-[55%]">
              Name of the Member
              <div>
                <input
                  type="text"
                  placeholder="Enter Name"
                  {...register(`members.${index}.nameOfTheMember`, {
                    required: "Name of the Member is required",
                  })}
                  className="w-full rounded-md border-2 border-gray-200 p-2 text-gray-600"
                />
              </div>
              {errors.members?.[index]?.nameOfTheMember && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.members?.[index]?.nameOfTheMember.message}
                </p>
              )}
            </div>
            <div className="w-full text-slate-600 md:w-[30%]">
              Role
              <div>
                <input
                  type="text"
                  placeholder="Enter Role"
                  {...register(`members.${index}.role`, {
                    required: "Role is required",
                  })}
                  className="w-full rounded-md border-2 border-gray-200 p-2 text-gray-600"
                />
              </div>
              {errors.members?.[index]?.role && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.members?.[index]?.role.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="relative flex w-5/6 items-end justify-end gap-4 rounded-lg md:left-28">
        {fields.map((field, index) => (
          <button
            key={field.id}
            type="button"
            onClick={() => handleRemoveRow(index)}
            className="flex flex-row items-center justify-center gap-2 rounded-xl bg-red-50 p-3 text-red-600 shadow-xl shadow-[#3877C20D] hover:bg-red-100"
          >
            <TrashIcon className="h-5 w-5" />
            Remove {index + 1}
          </button>
        ))}

        <button
          className="flex flex-row items-center justify-center gap-2 rounded-xl bg-white p-3 text-gray-400 shadow-xl shadow-[#3877C20D]"
          type="button"
          disabled={fields.length >= 5}
          onClick={() =>
            append({
              photo: "",
              role: "",
              nameOfTheMember: "",
            })
          }
        >
          <img
            src="/assets/images/Group 47748 (1).png"
            alt=""
            className="h-6 w-6"
          />
          Add Member
        </button>
      </div>

      <div className="relative mt-6 flex w-5/6 items-end justify-end rounded-lg md:left-28">
        <button
          type="submit"
          className="flex flex-row items-center justify-center rounded-xl  bg-[#007AFF] hover:bg-[#007bffd0] px-3 py-2 text-white"
        >
          Next Step <ChevronsRight />
        </button>
      </div>
    </form>
  );
};

export default BoardOfDirectorForm;
