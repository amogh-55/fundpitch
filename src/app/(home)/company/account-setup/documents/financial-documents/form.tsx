"use client";

import UploadButton from "@/app/(home)/_components/UploadButton";
import { toast } from "@/components/ui/use-toast";
import { api, RouterOutputs } from "@/trpc/react";
import { ChevronsRight, X, File, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import useDelete from "@/hooks/useDelete";

interface doc {
  file: string;
  fileName: string;
  fileType: string;
}

interface form {
  docs: doc[];
}

const FinancialDocumentsForm = ({
  financialDocs,
  revalidateRoute,
}: {
  financialDocs: RouterOutputs["company"]["getFinancialDocs"];
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
    getValues,
    formState: { errors },
  } = useForm<form>({
    defaultValues: {
      docs: financialDocs.map((doc) => ({
        file: doc.file ?? "",
        fileName: doc.fileName ?? "",
        fileType: doc.fileType ?? "",
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "docs" });

  const { mutate } = api.company.addFinancialDocs.useMutation({
    onSuccess: () => {
      toast({
        description: "Added sucessfully",
      });
      void revalidateRoute();
      router.push("/company/account-setup/products");
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
    },
  });

  const { mutate: deleteDoc } = api.company.deleteFinDoc.useMutation({
    onSuccess: () => {
      toast({
        description: "Deleted successfully",
      });
      void revalidateRoute();
    },
  });

  const { mutate: updateFinancialDocFile } =
    api.company.updateFinancialDocFile.useMutation({
      onSuccess: () => {
        toast({
          description: "Updated successfully",
        });
      },
    });
  const onSubmit = (_data: form) => {
    const members = getValues("docs");

    // if (members.length === 0) {
    //   toast({
    //     description: "Please fill the details",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    const existingIds = new Set(financialDocs.map((doc) => doc.fileName));

    members.forEach((docs) => {
      if (!existingIds.has(docs.fileName)) {
        mutate({
          file: docs.file,
          fileName: docs.fileName,
          fileType: docs.fileType,
        });
      }
    });

    router.push("/company/account-setup/products");
  };

  const handleDeleteFile = async (index: number, file: string) => {
    if (file) {
      await handleDelete(file);
      setValue(`docs.${index}.file`, "");
      setValue(`docs.${index}.fileName`, "");
      setValue(`docs.${index}.fileType`, "");

      const doc = financialDocs[index];
      if (doc?.id) {
        updateFinancialDocFile({
          id: doc.id,
          file: null,
          fileName: null,
          fileType: null,
        });
      }
    }
  };

  const handleRemoveRow = async (index: number) => {
    const doc = financialDocs[index];

    // Delete file if exists
    const file = watch(`docs.${index}.file`);
    if (file) {
      await handleDelete(file);
    }

    // Delete from database if exists
    if (doc?.id) {
      deleteDoc({ id: doc.id });
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
              <p className="mb-2 font-normal text-black text-xs sm:text-sm">Upload Financials</p>
              <label
                htmlFor={`file-upload-${index}`}
                className="relative flex h-28 sm:h-36 w-36 sm:w-48 max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-400 bg-gray-200"
              >
                {watch(`docs.${index}.file`) ? (
                  <div className="relative flex h-full w-full flex-col items-center justify-center">
                    <div className="flex flex-col items-center">
                      <File size={28} className="mb-2 sm:mb-3 text-gray-800" />
                      <a
                        href={watch(`docs.${index}.file`)}
                        target="_blank"
                        className="max-w-[80%] truncate text-xs sm:text-sm text-gray-700"
                      >
                        {watch(`docs.${index}.fileName`) || "financial.pdf"}
                      </a>
                    </div>

                    {/* Delete button - positioned at top-right */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        void handleDeleteFile(
                          index,
                          watch(`docs.${index}.file`),
                        );
                      }}
                      className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-red-500 p-1.5 text-white transition-colors duration-200 hover:bg-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <UploadButton
                    {...register(`docs.${index}.file`, {
                      required: "File is required",
                    })}
                    folderName="profile"
                    callback={async (url) => {
                      setValue(`docs.${index}.file`, url);
                      clearErrors(`docs.${index}.file`)
                    }}
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="h-full w-full"
                  >
                    <span className="flex flex-col items-center justify-center">
                      <File size={28} className="mb-2 sm:mb-3 text-gray-800" />
                      <p className="text-xs sm:text-sm text-[#4C535F]">
                        Upload{" "}
                        {watch(`docs.${index}.fileType`)?.toUpperCase() ||
                          "File"}
                      </p>
                    </span>
                  </UploadButton>
                )}
              </label>
              {errors.docs?.[index]?.file && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.docs?.[index]?.file.message}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col space-y-3 sm:space-y-4">
              <span>
                <p className="text-xs sm:text-sm">File Type</p>
                <select
                  {...register(`docs.${index}.fileType`)}
                  className="w-full rounded-md border border-gray-200 p-2 sm:p-4 text-xs sm:text-sm text-gray-600"
                >
                  <option value="">Select file type</option>
                  <option value="pdf">PDF</option>
                  <option value="doc">DOC/DOCX</option>
                  <option value="xls">XLS/XLSX</option>
                </select>
                {errors.docs?.[index]?.fileType && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.docs?.[index]?.fileType.message}
                  </p>
                )}
              </span>

              <span>
                <p className="text-xs sm:text-sm">File Name</p>
                <input
                  type="text"
                  placeholder="Enter file name"
                  {...register(`docs.${index}.fileName`, {
                    required: "file Name is required",
                  })}
                  className="w-full rounded-md border-2 border-gray-200 p-1.5 sm:p-2 text-xs sm:text-sm text-gray-600"
                />
                {errors.docs?.[index]?.fileName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.docs?.[index]?.fileName.message}
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
              fileType: "",
            })
          }
        >
          <img
            src="/assets/images/Group 47748 (1).png"
            alt=""
            className="h-5 w-5 sm:h-6 sm:w-6"
          />
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

export default FinancialDocumentsForm;
