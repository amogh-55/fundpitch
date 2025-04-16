"use client";

import UploadButton from "@/app/(home)/_components/UploadButton";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { ChevronsRight, X, File, ImagePlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { RouterOutputs } from "@/trpc/react";
import useDelete from "@/hooks/useDelete";

interface product {
  photo: string;
  nameOfTheProduct: string;
  productType: string;
  about: string;
}

interface form {
  products: product[];
}

const ProductsForm = ({
  products,
  revalidateRoute,
}: {
  products: RouterOutputs["company"]["getProducts"];
  revalidateRoute: () => Promise<void>;
}) => {
  const router = useRouter();
  const { handleDelete } = useDelete({});

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm<form>({
    defaultValues: {
      products: products.map((product) => ({
        photo: product.photo ?? "",
        nameOfTheProduct: product.nameOfTheProduct ?? "",
        productType: product.productType ?? "",
        about: product.about ?? "",
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const { mutate } = api.company.addProducts.useMutation({
    onSuccess: () => {
      toast({
        description: "Added sucessfully",
      });
      void revalidateRoute();
      router.push("/company/home");
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
    },
  });

  const { mutate: deleteProduct } = api.company.deleteProduct.useMutation({
    onSuccess: () => {
      toast({
        description: "Deleted successfully",
      });
      void revalidateRoute();
    },
  });

  const { mutate: updateProductPhoto } =
    api.company.updateProductPhoto.useMutation({
      onSuccess: () => {
        toast({
          description: "Updated successfully",
        });
      },
    });
  const onSubmit = (_data: form) => {
    const members = getValues("products");

    // if (members.length === 0) {
    //   toast({
    //     description: "Please fill the details",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    const existingIds = new Set(
      products.map((product) => product.nameOfTheProduct),
    );

    members.forEach((prod) => {
      if (!existingIds.has(prod.nameOfTheProduct)) {
        mutate({
          about: prod.about,
          nameOfTheProduct: prod.nameOfTheProduct,
          productType: prod.productType,
          photo: prod.photo,
        });
      }
    });
    router.push("/company/home");
  };

  const handleDeletePhoto = async (index: number, photo: string) => {
    if (photo) {
      await handleDelete(photo);
      setValue(`products.${index}.photo`, "");

      const product = products[index];
      if (product?.id) {
        updateProductPhoto({ id: product.id, photo: null });
      }
    }
  };

  const handleRemoveRow = async (index: number) => {
    const product = products[index];

    // Delete photo if exists
    const photo = watch(`products.${index}.photo`);
    if (photo) {
      await handleDelete(photo);
    }

    // Delete from database if exists
    if (product?.id) {
      deleteProduct({ id: product.id });
    }

    // Remove from form
    remove(index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-5 text-xs sm:text-sm">
      <div className="mb-4 sm:mb-5 flex items-center justify-between px-3 sm:px-10">
        <button
          className="flex flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl bg-white p-1.5 sm:p-2 text-center text-xs sm:text-sm text-gray-400 shadow-xl shadow-[#3876c20c]"
          type="button"
          disabled={fields.length >= 5}
          onClick={() =>
            append({
              photo: "",
              nameOfTheProduct: "",
              about: "",
              productType: "",
            })
          }
        >
          <img
            src="/assets/images/addmore.png"
            alt=""
            className="h-5 w-5 sm:h-8 sm:w-8"
          />{" "}
          <p className="text-xs sm:text-sm">Add Product</p>
        </button>

        <div className="flex gap-2 sm:gap-4 mr-3 sm:mr-10">
          {fields.map((field, index) => (
            <button
              key={field.id}
              type="button"
              onClick={() => handleRemoveRow(index)}
              className="flex flex-row items-center justify-center gap-1 sm:gap-2 rounded-xl bg-red-50 p-1.5 sm:p-3 text-xs sm:text-sm text-red-600 shadow-xl shadow-[#3877C20D] hover:bg-red-100"
            >
              <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              Remove {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-3 sm:m-5 mb-8 sm:mb-14 mt-0 flex-col rounded-xl shadow-xl shadow-[#3877C20D] md:flex-col">
        {fields.map((member, index) => (
          <div
            key={member.id}
            className="relative mb-6 sm:mb-10 flex flex-col items-center gap-3 sm:gap-4 lg:flex-row"
          >
            <div className="w-full lg:w-[30%]">
              <div className="group relative">
                <label
                  htmlFor={`file-upload-${index}`}
                  className="relative flex h-56 w-full max-w-xs mx-auto sm:h-56 lg:w-64  lg:max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-gray-200"
                >
                  {watch(`products.${index}.photo`) ? (
                    <>
                      <img
                        src={watch(`products.${index}.photo`)}
                        alt="Uploaded"
                        className="h-full w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          void handleDeletePhoto(
                            index,
                            watch(`products.${index}.photo`),
                          );
                        }}
                        className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-red-500 p-1.5 text-white transition-colors duration-200 hover:bg-red-600"
                      >
                        <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </>
                  ) : (
                    <UploadButton
                      {...register(`products.${index}.photo`, {
                        required: "photo is required",
                      })}
                      folderName="profile"
                      callback={async (url) => {
                        setValue(`products.${index}.photo`, url);
                        clearErrors(`products.${index}.photo`);
                      }}
                      accept="image/*"
                      className="h-full w-full"
                    >
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <ImagePlusIcon
                          size={28}
                          className="mb-2 sm:mb-3 text-gray-400"
                        />
                        <p className="text-xs sm:text-sm text-[#4C535F]">Upload Logo</p>
                      </div>
                    </UploadButton>
                  )}
                </label>
                {errors.products?.[index]?.photo && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.products?.[index]?.photo.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:gap-4 p-3 sm:p-5 mt-4 lg:mt-0 lg:w-[70%]">
              <div className="flex w-full flex-col gap-4 sm:gap-10 md:flex-row">
                <span className="w-full md:w-1/2">
                  <p className="text-xs sm:text-sm">Name of the Product</p>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    {...register(`products.${index}.nameOfTheProduct`, {
                      required: "Product Name is required",
                    })}
                    className="w-full rounded-md border-2 border-gray-200 p-1.5 sm:p-2 text-xs sm:text-sm text-gray-600"
                  />
                  {errors.products?.[index]?.nameOfTheProduct && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.products?.[index]?.nameOfTheProduct.message}
                    </p>
                  )}
                </span>

                <span className="w-full md:w-1/2">
                  <p className="text-xs sm:text-sm">Product Type</p>
                  <input
                    type="text"
                    placeholder="Enter value"
                    {...register(`products.${index}.productType`, {
                      required: "Type is required",
                    })}
                    className="w-full rounded-md border-2 border-gray-200 p-1.5 sm:p-2 text-xs sm:text-sm text-gray-600"
                  />
                  {errors.products?.[index]?.productType && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.products?.[index]?.productType.message}
                    </p>
                  )}
                </span>
              </div>
              <div className="text-balck w-full">
                <p className="text-xs sm:text-sm">About</p>
                <div>
                  <textarea
                    placeholder="Enter text (max 50 words)"
                    {...register(`products.${index}.about`, {
                      required: "About is required",
                    })}
                    className="h-20 sm:h-28 w-full rounded-md border-2 border-gray-200 p-1.5 sm:p-2 text-xs sm:text-sm text-gray-600"
                  />
                  {errors.products?.[index]?.about && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.products?.[index]?.about.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 sm:mt-6 flex w-5/6 items-end justify-end rounded-lg lg:left-28">
        <button
          type="submit"
          className="flex flex-row items-center justify-center rounded-xl bg-[#007AFF] hover:bg-[#007bffd0] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white"
        >
          Next Step <ChevronsRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1" />
        </button>
      </div>
    </form>
  );
};

export default ProductsForm;
