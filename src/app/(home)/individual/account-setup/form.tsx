"use client";
import {
  File,
  ImagePlusIcon,
  LogOut,
  X,
  Loader2,
  TrashIcon,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import UserTopBar from "../_components/topbar";
import UploadButton from "../../_components/UploadButton";
import { api, RouterOutputs } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import useDelete from "@/hooks/useDelete";
import { useRouter } from "next/navigation";
import LogoutButton from "../../_components/LogoutButton";

interface form {
  name: string;
  designation: string;
  contactNumber: string;
  email: string;
  file: string;
  fullAddress: string;
  bio: string;
  files: (string | null)[];
}

const IndividualsForm = ({
  individualDetails,
  revalidateRoute,
  user,
  individualDocuments,
}: {
  individualDetails: RouterOutputs["individual"]["getIndividualDetails"];
  user: RouterOutputs["user"]["getUser"];
  revalidateRoute: () => void;
  individualDocuments: RouterOutputs["individual"]["getIndividualDocuments"];
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<form>({
    defaultValues: {
      name: individualDetails?.name ?? "",
      designation: individualDetails?.designation ?? "",
      contactNumber: individualDetails?.contactNumber ?? user?.phone ?? "",
      email: individualDetails?.email ?? user?.email ?? "",
      file: individualDetails?.photo ?? "",
      fullAddress: individualDetails?.fullAddress ?? "",
      bio: individualDetails?.bio ?? "",
      files: individualDocuments?.map((document) => document.file) ?? [],
    },
  });
  const router = useRouter();
  const { handleDelete } = useDelete({});

  const { mutate: addIndividualDocuments, isPending: isAddingDocuments } =
    api.individual.addIndividualDocuments.useMutation({
      onSuccess: () => {
        toast({
          description: "Documents added",
        });
      },
    });
  const { mutate, isPending } = api.individual.addIndividualDetails.useMutation(
    {
      onSuccess: () => {
        toast({
          description: "Details filled",
        });
        void revalidateRoute();
        router.push("/individual/home");
      },
      onError: (error) => {
        toast({
          description: error.message,
        });
      },
    },
  );

  const { mutateAsync: deleteDocument } =
    api.individual.deleteIndividualDocument.useMutation({
      onSuccess: () => {
        toast({
          description: "Document deleted successfully",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          description: "Failed to delete document",
        });
      },
    });

  // Register files with validation
  register("files", {
    required: "At least one file is required",
    validate: (value) => {
      if (value.length === 0) return "At least one file is required";
      if (value.length > 5) return "Maximum 5 files allowed";
      return true;
    },
  });

  const files = watch("files");

  const handleAddFile = (url: string) => {
    if (files.length >= 5) {
      toast({
        variant: "destructive",
        description: "Maximum 5 files allowed",
      });
      return;
    }
    addIndividualDocuments({ file: url });
    setValue("files", [...files, url]);
  };

  const handleRemoveFile = async (indexToRemove: number) => {
    const fileToDelete = files[indexToRemove];

    console.log({ fileToDelete });

    try {
      await Promise.all([
        handleDelete(fileToDelete ?? ""),
        deleteDocument({ file: fileToDelete ?? "" }),
      ]);

      const newFiles = files.filter((_, index) => index !== indexToRemove);
      setValue("files", newFiles, {
        shouldValidate: true,
      });

      toast({
        description: "File removed successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete file",
      });
    }
  };

  const onSubmit = (data: form) => {
    const requiredFields: (keyof form)[] = [
      "name",
      "designation",
      "contactNumber",
      "fullAddress",
      "email",
      "bio",
    ];

    const emptyFields = requiredFields.filter((field) => !data[field]);

    if (emptyFields.length > 0) {
      toast({
        description: `Please fill in the following fields: ${emptyFields.join(", ")}`,
      });
      return;
    }

    mutate(data);
  };

  return (
    <div className="mx-2 mt-6 sm:mx-4 md:m-8 lg:m-12">
      <span className="mb-4 flex flex-row items-center justify-between text-center">
        <button className="flex flex-row text-xl font-bold">
          Fund<p className="text-[#2595BE]">Pitch</p>
        </button>

        <LogoutButton />
      </span>
      <div className="flex h-full w-full flex-grow flex-col rounded-xl shadow-md">
        <UserTopBar users={user} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex h-full w-full"
        >
          <div className="bg-white-1 grid w-full grid-cols-1 gap-3 p-2 px-3 text-sm sm:gap-4 sm:px-6 md:grid-cols-2 md:gap-6 md:px-10 lg:gap-10 lg:px-16">
            <div className="w-full">
              <label className="mb-1 block">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full rounded border p-2"
                placeholder="Enter Name"
              />
              <p className="text-xs text-red-500">{errors.name?.message}</p>
            </div>
            <div className="w-full">
              <label className="mb-1 block">Designation</label>
              <input
                {...register("designation", {
                  required: "Designation is required",
                })}
                className="w-full rounded border p-2"
                placeholder="Enter here"
              />
              <p className="text-xs text-red-500">
                {errors.designation?.message}
              </p>
            </div>
            <div className="w-full">
              <label className="mb-1 block">Contact Number</label>
              <input
                {...register("contactNumber", {
                  required: "Contact Number is required",
                })}
                className="w-full rounded border p-2"
                placeholder="Enter Number"
              />
              <p className="text-xs text-red-500">
                {errors.contactNumber?.message}
              </p>
            </div>
            <div className="w-full">
              <label className="mb-1 block">Email Id</label>
              <input
                {...register("email", { required: "Email is required" })}
                className="w-full rounded border p-2"
                placeholder="Enter email"
              />
              <p className="text-xs text-red-500">{errors.email?.message}</p>
            </div>
            <div className="w-full md:col-span-2">
              <label className="mb-1 block">Full Address</label>
              <input
                {...register("fullAddress", {
                  required: "Address is required",
                })}
                className="w-full rounded border p-2"
                placeholder="Enter address"
              />
              <p className="text-xs text-red-500">
                {errors.fullAddress?.message}
              </p>
            </div>
            <div className="w-full md:col-span-2">
              <label className="mb-1 flex items-center gap-1">
                Showcase your Expertise
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex w-full flex-col gap-4 sm:gap-6 md:flex-row md:gap-8">
                <div
                  className={`w-full cursor-pointer border-2 border-dashed ${
                    files.length >= 5
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-600"
                  } md:w-1/2`}
                >
                  {files.length >= 5 ? (
                    <>
                      <div className="flex h-32 w-full items-center justify-center text-sm text-gray-500 sm:h-40 md:h-48">
                        Maximum files reached
                      </div>
                    </>
                  ) : (
                    <UploadButton
                      folderName="profile"
                      callback={async (url) => {
                        if (files.length >= 5) {
                          toast({
                            variant: "destructive",
                            description: "Maximum 5 files allowed",
                          });
                          return;
                        }
                        handleAddFile(url);
                      }}
                      accept=".pdf"
                      className="h-32 w-full sm:h-40 md:h-48"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <ImagePlusIcon
                          size={38}
                          className={`mb-2 sm:mb-3 ${files.length >= 5 ? "text-gray-300" : "text-gray-400"}`}
                        />
                        <div
                          className={`text-xs ${files.length >= 5 ? "text-gray-400" : "text-gray-700"}`}
                        >
                          {files.length >= 5 ? (
                            "Maximum files reached"
                          ) : (
                            <>
                              Drag and drop your file or{" "}
                              <span>choose file</span>
                              <p className="mt-1 text-xs text-gray-500">
                                {files.length === 0 ? (
                                  <span className="text-red-500">
                                    At least one file required
                                  </span>
                                ) : (
                                  `${5 - files.length} files remaining`
                                )}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </UploadButton>
                  )}
                </div>

                <div className="flex h-32 w-full flex-col gap-3 overflow-y-auto px-2 sm:h-40 sm:px-3 md:h-48 md:w-1/2 md:px-4">
                  {errors.files && (
                    <p className="text-xs text-red-500">
                      {errors.files?.message}
                    </p>
                  )}
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-2 shadow-sm sm:p-3"
                    >
                      <div className="flex flex-row items-center gap-2">
                        <File size={16} />
                        <a
                          href={file ?? ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="max-w-[150px] truncate text-xs hover:underline sm:max-w-none sm:text-sm"
                        >
                          {`Showcase_${index + 1}`}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleRemoveFile(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        {isPending ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <TrashIcon
                            size={16}
                            className={files.length <= 1 ? "opacity-50" : ""}
                          />
                        )}
                      </button>
                    </div>
                  ))}
                  {files.length === 0 && (
                    <div className="flex h-full items-center justify-center text-xs text-gray-500 sm:text-sm">
                      Please upload at least one file
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:col-span-2">
              <label className="mb-1 block">Your Bio</label>
              <textarea
                {...register("bio", { required: "Bio is required" })}
                className="h-24 w-full rounded border p-2 sm:h-28 md:h-32"
                placeholder="Talk about yourself (max 200 words)"
              />
              <p className="text-xs text-red-500">{errors.bio?.message}</p>
            </div>
            <div className="mt-4 flex justify-center sm:justify-end md:col-span-2">
              <button
                className="w-full max-w-xs rounded-full bg-[#007AFF] px-6 py-2 text-white hover:bg-[#007bffd0] sm:w-auto sm:px-8"
                type="submit"
              >
                {isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndividualsForm;
