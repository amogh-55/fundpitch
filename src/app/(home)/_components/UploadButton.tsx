"use client";
import React, { Fragment, useRef, useState } from "react";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { LoaderCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import useUpload from "@/hooks/useUpload";

const UploadButton = ({
  children,
  folderName,
  callback,
  accept = "image/*",
  isDropzone = false,
  className,
}: {
  children: React.ReactNode;
  folderName: string;
  callback: (url: string) => void;
  accept?: string;
  isDropzone?: boolean;
  className?: string;
}) => {
  const [photos, setPhotos] = useState<File[]>([]);

  const photoRef = useRef<HTMLInputElement>(null);

  const { handleUpload, uploading } = useUpload({
    files: photos,
    callback: (id) => {
      if (id) {
        callback(`https://images.fundpitch.com/${folderName}/${id}`);
        setPhotos([]);
        toast({
          type: "foreground",
          title: "Uploaded successfully",
        });
      }
    },
  });

  if (isDropzone) {
    if (uploading)
      return (
        <div className="flex w-72 flex-col items-center gap-2 rounded-md bg-[#F5F5F5] py-14">
          <LoaderCircle className="text-primaryColor h-8 w-8 animate-spin" />
        </div>
      );

    return (
      <Dropzone
        multiple
        accept={{
          ...(accept?.includes("image/*")
            ? {
                "image/*": ["jpg", "jpeg", "png"],
              }
            : {}),

          ...(accept?.includes("application/pdf")
            ? {
                "application/pdf": ["pdf"],
              }
            : {}),
          ...(accept?.includes("application/msword")
            ? {
                "application/msword": ["doc", "docx"],
              }
            : {}),

          ...(accept?.includes(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          )
            ? {
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                  ["docx"],
              }
            : {}),
          ...(accept?.includes("application/vnd.ms-excel")
            ? {
                "application/vnd.ms-excel": ["xls", "xlsx"],
              }
            : {}),
          ...(accept.includes("video/*")
            ? {
                "video/*": ["mp4", "mov", "avi"],
              }
            : {}),
        }}
        onDrop={(acceptedFiles) => {
          const validFiles = acceptedFiles.filter((file) => {
            if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024)
              return true;
            if (file.type.startsWith("video/") && file.size <= 50 * 1024 * 1024)
              return true;
            return false;
          });
          if (validFiles.length !== acceptedFiles.length) {
            return toast({
              type: "foreground",
              title:
                "Some files are too large. Max size is 5MB for images and 50MB for videos.",
            });
          }
          setPhotos((prevFiles) => [...prevFiles, ...validFiles]);
          handleUpload({ folderName });
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="flex w-full flex-col items-center rounded-md bg-[#F5F5F5] py-14 text-center"
          >
            <input {...getInputProps()} />
            <Image
              src="/assets/ph_upload-duotone.png"
              alt="upload"
              width={15}
              height={10}
              className="mb-4 h-12 w-12"
            />
            <p className="text-xs text-black/30">Drag & Drop here </p>
          </div>
        )}
      </Dropzone>
    );
  }

  if (uploading)
    return (
      <Button
        type="button"
        className={`bg-primaryColor hover:bg-primaryColor/80 px-2 py-1 text-white`}
      >
        <LoaderCircle className="h-6 w-6 animate-spin text-white" />
      </Button>
    );

  return (
    <Fragment>
      <button
        type="button"
        className={className}
        onClick={() => {
          if (photoRef.current) {
            photoRef.current.click();
          }
        }}
      >
        {children}
      </button>
      <input
        type="file"
        ref={photoRef}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          const validFiles = files.filter(
            (file) => file.size <= 5 * 1024 * 1024,
          );
          if (validFiles.length !== files.length) {
            return toast({
              type: "foreground",
              title: "Some files are too large. Max size is 5MB",
            });
          }
          setPhotos((prevFiles) => [...prevFiles, ...validFiles]);
          handleUpload({ folderName });
        }}
        className="hidden"
        accept={accept}
        multiple
      />
    </Fragment>
  );
};

export default UploadButton;
