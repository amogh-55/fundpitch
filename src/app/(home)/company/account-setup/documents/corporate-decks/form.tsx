"use client";

import UploadButton from "@/app/(home)/_components/UploadButton";
import { toast } from "@/components/ui/use-toast";
import { api, RouterOutputs } from "@/trpc/react";
import { ChevronsRight, X, File, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import useDelete from "@/hooks/useDelete";

interface deck {
  file: string;
  fileName: string;
}

interface form {
  decks: deck[];
}

const CorporateDecksForm = ({
  corporateDecks,
  revalidateRoute,
}: {
  corporateDecks: RouterOutputs["company"]["getCorporateDecks"];
  revalidateRoute: () => Promise<void>;
}) => {
  const router = useRouter();
  const { handleDelete } = useDelete({});

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm<form>({
    defaultValues: {
      decks: corporateDecks.map((deck) => ({
        fileName: deck.fileName ?? "",
        file: deck.file ?? "",
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "decks" });

  const { mutate } = api.company.addCorporateDeck.useMutation({
    onSuccess: () => {
      toast({
        description: "Added sucessfully",
      });
      void revalidateRoute();
      router.push("/company/account-setup/documents/financial-documents");
    },
    onError: (error) => {
      console.log(error);
      toast({
        description: error.message,
      });
    },
  });

  const { mutate: deleteDeck } = api.company.deleteDeck.useMutation({
    onSuccess: () => {
      toast({
        description: "Deleted successfully",
      });
      void revalidateRoute();
    },
  });

  const { mutate: updateCorporateDeckFile } =
    api.company.updateCorporateDeckFile.useMutation({
      onSuccess: () => {
        toast({
          description: "Updated successfully",
        });
      },
    });
  const onSubmit = (_data: form) => {
    console.log("Submitting");
    const members = getValues("decks");

    // if (members.length === 0) {
    //   console.log("No members");
    //   toast({
    //     description: "Please fill the details",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    // Only submit verticals that don't exist in businessVerticals
    const existingIds = new Set(corporateDecks.map((deck) => deck.fileName));

    members.forEach((member) => {
      if (!existingIds.has(member.fileName)) {
        mutate({
          file: member.file,
          fileName: member.fileName,
        });
      }
    });
    router.push("/company/account-setup/documents/financial-documents");
  };

  const handleDeleteFile = async (index: number, file: string) => {
    if (file) {
      await handleDelete(file);
      setValue(`decks.${index}.file`, "");
      setValue(`decks.${index}.fileName`, "");

      const deck = corporateDecks[index];
      if (deck?.id) {
        updateCorporateDeckFile({
          id: deck.id,
          file: null,
          fileName: null,
        });
      }
    }
  };

  const handleRemoveRow = async (index: number) => {
    const deck = corporateDecks[index];

    // Delete file if exists
    const file = watch(`decks.${index}.file`);
    if (file) {
      await handleDelete(file);
    }

    // Delete from database if exists
    if (deck?.id) {
      deleteDeck({ id: deck.id });
    }

    // Remove from form
    remove(index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-5 text-xs sm:text-sm">
      <div className="m-5 mb-8 mt-0 w-11/12 rounded-xl p-4 sm:p-5 shadow-xl shadow-[#3877C20D]">
        {fields.map((member, index) => (
          <div
            key={member.id}
            className="flex flex-col items-center gap-6 sm:gap-10 pb-6 sm:pb-8 lg:flex-row"
          >
            <div className="flex flex-col items-center">
              <p className="mb-2 font-normal text-black text-xs sm:text-sm">Upload Decks</p>
              <div className="group relative">
                <label
                  htmlFor={`file-upload-${index}`}
                  className="flex h-28 sm:h-36 w-36 sm:w-48 max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-400 bg-gray-200"
                >
                  {watch(`decks.${index}.file`) ? (
                    <div className="relative flex h-full w-full flex-col items-center justify-center">
                      {/* File display */}
                      <div className="flex flex-col items-center">
                        <File size={28} className="mb-2 sm:mb-3 text-gray-800" />
                        <p className="max-w-[80%] truncate text-xs sm:text-sm text-gray-700">
                          {watch(`decks.${index}.fileName`) || "Deck.pdf"}
                        </p>
                      </div>

                      {/* Delete button - now positioned at top-right corner */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          void handleDeleteFile(
                            index,
                            watch(`decks.${index}.file`),
                          );
                        }}
                        className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-red-500 p-1.5 text-white transition-colors duration-200 hover:bg-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadButton
                      {...register(`decks.${index}.file`, {
                        required: "File is required",
                      })}
                      folderName="profile"
                      callback={async (url) => {
                        setValue(`decks.${index}.file`, url);
                        clearErrors(`decks.${index}.file`)
                      }}
                      accept="image/*,video/*"
                      className="h-full w-full"
                    >
                      <span className="flex flex-col items-center justify-center">
                        <File size={32} className="mb-2 sm:mb-3 text-gray-800" />
                        <p className="text-xs sm:text-sm text-[#4C535F]">Upload File</p>
                      </span>
                    </UploadButton>
                  )}
                </label>
              </div>
              {errors.decks?.[index]?.file && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.decks?.[index]?.file.message}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col space-y-3 sm:space-y-4">
              <span>
                <p className="text-xs sm:text-sm">File Name</p>
                <input
                  type="text"
                  placeholder="Enter file name"
                  {...register(`decks.${index}.fileName`, {
                    required: "File Name is required",
                  })}
                  className="w-full rounded-md border-2 border-gray-200 p-1.5 sm:p-2 text-xs sm:text-sm text-gray-600"
                />
                {errors.decks?.[index]?.fileName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.decks?.[index]?.fileName.message}
                  </p>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex w-5/6 items-end justify-end gap-3 sm:gap-4 rounded-lg md:left-28">
        {fields.map((field, index) => (
          <button
            key={field.id}
            type="button"
            onClick={() => handleRemoveRow(index)}
            className="flex flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl bg-red-50 p-2 sm:p-3 text-xs sm:text-sm text-red-600 shadow-xl shadow-[#3877C20D] hover:bg-red-100"
          >
            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Remove {index + 1}
          </button>
        ))}

        <button
          className="flex flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl bg-white p-2 sm:p-3 text-xs sm:text-sm text-gray-400 shadow-xl shadow-[#3877C20D]"
          type="button"
          disabled={fields.length >= 5}
          onClick={() =>
            append({
              file: "",
              fileName: "",
            })
          }
        >
          <img src="/assets/images/addmore.png" alt="" className="h-5 w-5 sm:h-6 sm:w-6" />
          Add More
        </button>
      </div>

      <div className="relative mt-4 sm:mt-6 flex w-5/6 items-end justify-end rounded-lg md:left-28">
        <button
          type="submit"
          className="flex flex-row items-center justify-center rounded-xl bg-[#007AFF] hover:bg-[#007bffd0] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white"
        >
          Next Step <ChevronsRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </form>
  );
};

export default CorporateDecksForm;
