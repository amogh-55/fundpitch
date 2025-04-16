"use client";
import { Controller, useForm } from "react-hook-form";
import ReactSelect, { SingleValue } from "react-select";
import { api, RouterOutputs } from "@/trpc/react";
import CompanySideBar from "../_components/sidebar";
import { ChevronsRight, ImagePlusIcon } from "lucide-react";
import { useState } from "react";
import UploadButton from "@/app/(home)/_components/UploadButton";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface compantDetailsForm {
  companyName: string;
  registartionNumber: string;
  founderName: string;
  class: string;
  listingStatus: string;
  stage: string;
  yearOfIncorporation: string;
  marketCapital: string;
  officePhone: string;
  sectors: string;
  companyEmailID: string;
  companyWebsiteURL: string;
  companyAddress: string;
  about: string;
}

const BasicDetailsForm = ({
  basicDetails,
  user,
  revalidateRoute,
}: {
  basicDetails: RouterOutputs["company"]["getBasicDetails"];
  user: RouterOutputs["user"]["getUser"];
  revalidateRoute: () => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<compantDetailsForm>({
    defaultValues: {
      companyName: basicDetails?.companyName ?? "",
      founderName: basicDetails?.founderName ?? "",
      registartionNumber: basicDetails?.registartionNumber ?? "",
      class: basicDetails?.class ?? "",
      listingStatus: basicDetails?.listingStatus ?? "",
      stage: basicDetails?.stage ?? "",
      yearOfIncorporation: basicDetails?.yearOfIncorporation ?? "",
      marketCapital: basicDetails?.marketCapital ?? "",
      sectors: basicDetails?.sectors ?? "",
      companyEmailID: basicDetails?.companyEmailID ?? user?.email ?? "",
      officePhone: basicDetails?.officePhone ?? user?.phone ?? "",
      companyWebsiteURL: basicDetails?.companyWebsiteURL ?? "",
      companyAddress: basicDetails?.companyAddress ?? "",
      about: basicDetails?.about ?? "",
    },
  });

  const router = useRouter();

  const utils = api.useUtils();

  const { mutate } = api.company.registerCompanyDetails.useMutation({
    onSuccess: () => {
      toast({
        description: "Details filled",
      });
      void revalidateRoute();
      void utils.company.getCompanyPhoto.invalidate();
      router.push("/company/account-setup/team/boardofdirectors");
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
    },
  });

  const onSubmit = (data: compantDetailsForm) => {
    const requiredFields: (keyof compantDetailsForm)[] = [
      "companyName",
      "about",
      "founderName",
      "class",
      "companyAddress",
      "companyEmailID",
      "companyWebsiteURL",
      "listingStatus",
      "marketCapital",
      "registartionNumber",
      "sectors",
      "stage",
      "yearOfIncorporation",
    ];

    const allFieldsFilled = requiredFields.every((field) => watch(field));

    if (!allFieldsFilled) {
      toast({
        description: "Please fill all the details",
      });
    } else {
      mutate(data);
    }
  };

  return (
    <div className="flex w-full flex-col md:flex-row">
      {/* This is the only instance of the sidebar */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-grow flex-col pt-12 md:pt-0"
      >
        <div className="flex h-full w-full flex-grow">
          <div className="bg-white-1 w-full">
            <div className="grid grid-cols-1 gap-4 p-4 text-xs sm:gap-5 sm:p-5 md:grid-cols-2 md:gap-6 md:p-6 md:text-sm lg:p-8">
              <div className="md:col-span-2">
                <label className="mb-1 block">Company Name</label>
                <input
                  {...register("companyName", {
                    required: "Company Name is required",
                  })}
                  className="w-full rounded border p-2"
                  placeholder="Enter Name"
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.companyName?.message}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium sm:text-sm">
                  Founder Name
                </label>
                <input
                  {...register("founderName", {
                    required: "Founder Name is required",
                  })}
                  className="w-full rounded border p-1.5 text-xs sm:p-2 sm:text-sm"
                  placeholder="Enter Founder Name"
                />
                <p className="mt-0.5 mt-1 text-[10px] text-red-500 sm:text-xs">
                  {errors.founderName?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium sm:text-sm">
                  Registration Number
                </label>
                <input
                  {...register("registartionNumber", {
                    required: "Registration Number is required",
                  })}
                  type="text"
                  onKeyPress={(e) => {
                    if (/[^0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full rounded border p-1.5 text-xs sm:p-2 sm:text-sm"
                  placeholder="Enter Valid Number"
                />
                <p className="mt-0.5 mt-1 text-[10px] text-red-500 sm:text-xs">
                  {errors.registartionNumber?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium sm:text-sm">
                  Class
                </label>
                <Controller
                  control={control}
                  name="class"
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      placeholder="Select Option"
                      options={["Private", "Public"].map((cls) => ({
                        label: cls,
                        value: cls,
                      }))}
                      value={
                        field.value
                          ? {
                              label: field.value,
                              value: field.value,
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);
                      }}
                      className="text-xs sm:text-sm sm:text-xs"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "30px",
                          height: "auto",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 6px",
                        }),
                        input: (base) => ({
                          ...base,
                          margin: 0,
                          padding: 0,
                        }),
                      }}
                    />
                  )}
                />
                <p className="mt-0.5 text-[10px] text-xs text-red-500 sm:mt-1">
                  {errors.class?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block">Listing Status</label>
                <Controller
                  control={control}
                  name="listingStatus"
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      placeholder="Select Option"
                      options={["Listed", "Unlisted"].map((lis) => ({
                        label: lis,
                        value: lis,
                      }))}
                      value={
                        field.value
                          ? {
                              label: field.value,
                              value: field.value,
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);
                      }}
                      className="text-xs sm:text-sm"
                    />
                  )}
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.listingStatus?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block">Stage</label>
                <Controller
                  control={control}
                  name="stage"
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      placeholder="Select Option"
                      options={["Seeding", "Startup", "Growth", "Maturity"].map(
                        (stg) => ({
                          label: stg,
                          value: stg,
                        }),
                      )}
                      value={
                        field.value
                          ? {
                              label: field.value,
                              value: field.value,
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);
                      }}
                      className="text-xs sm:text-sm"
                    />
                  )}
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.stage?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block">Year of Incorporation</label>
                <input
                  type="text"
                  {...register("yearOfIncorporation", {
                    required: "Year is required",
                  })}
                  onKeyPress={(e) => {
                    if (/[^0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full rounded border p-2"
                  placeholder="Enter Valid Year"
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.yearOfIncorporation?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block">Market Capital</label>
                <input
                  {...register("marketCapital", {
                    required: "Market Capital is required",
                  })}
                  className="w-full rounded border p-2"
                  placeholder="Enter Value"
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.marketCapital?.message}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block">Sectors</label>
                <Controller
                  control={control}
                  name="sectors"
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      placeholder="Select Option"
                      options={[
                        "Information Technology (IT)",
                        "Healthcare & Pharmaceuticals",
                        "Banking & Finance",
                        "Education & E-Learning",
                        "Manufacturing",
                        "Retail & E-Commerce",
                        "Real Estate",
                        "Travel & Tourism",
                        " Media & Entertainment",
                        "Telecommunications",
                        " Aviation & Aerospace",
                        "Automobile & Transportation",
                        "Hospitality",
                        "Construction & Infrastructure",
                        "Agriculture",
                        "Energy & Utilities",
                        "Insurance",
                        "Logistics & Supply Chain",
                        "Government & Public Services",
                        "Marketing & Advertising",
                        "Legal Services",
                        "Oil & Gas",
                        " Food & Beverage",
                        "Sports & Fitness",
                        " Fashion & Apparel",
                        "Gaming",
                        "NGO & Social Services",
                        " Cybersecurity",
                        " Biotechnology",
                        "Consultancy Services",
                        "others",
                      ].map((sec) => ({
                        label: sec,
                        value: sec,
                      }))}
                      value={
                        field.value
                          ? {
                              label: field.value,
                              value: field.value,
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value);
                      }}
                      className="text-xs sm:text-sm"
                    />
                  )}
                />

                <p className="mt-1 text-xs text-red-500">
                  {errors.sectors?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block">Company Email ID</label>
                <input
                  type="email"
                  {...register("companyEmailID", {
                    required: "Email is required",
                  })}
                  className="w-full rounded border p-2"
                  placeholder="Enter ID"
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.companyEmailID?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block">Office Phone</label>
                <input
                  type="text"
                  {...register("officePhone", {
                    required: "Office Phone is required",
                  })}
                  onKeyPress={(e) => {
                    if (/[^0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full rounded border p-2"
                  placeholder="Enter Phone Number"
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.officePhone?.message}
                </p>
              </div>

              <div>
                <label className="mb-1 block">Company Website URL</label>
                <input
                  type="url"
                  {...register("companyWebsiteURL", {
                    required: "URL is required",
                    pattern: {
                      value: /^https?:\/\//,
                      message: "Enter valid URL",
                    },
                  })}
                  className="w-full rounded border p-2"
                  placeholder="Enter URL"
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.companyWebsiteURL?.message}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block">Address</label>
                <input
                  {...register("companyAddress", {
                    required: "Address is required",
                  })}
                  className="w-full rounded border p-2"
                  placeholder="Enter address"
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.companyAddress?.message}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block">About</label>
                <textarea
                  {...register("about", {
                    required: "About is required",
                  })}
                  rows={4}
                  className="w-full rounded border p-2"
                  placeholder="Enter Company's About"
                />
                <p className="mt-1 text-xs text-red-500">
                  {errors.about?.message}
                </p>
              </div>

              <div className="flex flex-row justify-end md:col-span-2">
                <button
                  type="submit"
                  className="mt-2 flex flex-row items-center justify-center rounded-xl bg-[#007AFF] px-3 py-1.5 text-sm text-white hover:bg-[#007bffd0] sm:px-4 sm:py-2"
                >
                  Next Step{" "}
                  <ChevronsRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BasicDetailsForm;
