import { useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

const useInterviewUpload = (callback: (url: string) => void) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate: getUploadURL } = api.user.getUploadURL.useMutation({
    onSuccess(data) {
      if (data.success) {
        try {
          const url = data?.uploadParams ?? "";
          const id = data?.id ?? "";

          if (!url || !id) throw new Error("Invalid upload URL");

          // Create interview URL
          const interviewUrl = `https://images.fundpitch.com/endorsements/${id}`;

          void uploadFile(url, id)
            .then(() => {
              setUploadProgress(100);
              callback(interviewUrl);
            })
            .catch((error) => {
              setUploading(false);
              setUploadProgress(0);

              if (error instanceof AxiosError) {
                console.log(error.response?.data);
                toast({
                  type: "foreground",
                  title: "Error in Uploading: " + "Please try again later",
                });
              } else {
                toast({
                  type: "foreground",
                  title: "Error in Uploading",
                });
              }
            });
        } catch (error) {
          setUploading(false);
          setUploadProgress(0);
          toast({
            title: "Failed to upload recording",
            variant: "destructive",
          });
        }
      } else {
        setUploading(false);
        setUploadProgress(0);
        toast({
          title: data?.error ?? "Upload failed",
          variant: "destructive",
        });
      }
    },
    onError(error) {
      setUploading(false);
      setUploadProgress(0);
      toast({
        title: error.message ?? "Upload failed",
        variant: "destructive",
      });
    },
  });

  const uploadFile = async (url: string, id: string) => {
    const contentType = "audio/mp3";
    const file = new File([blobRef.current!], `interview-${Date.now()}.mp3`, {
      type: contentType,
    });

    await axios.put(`${url}`, file, {
      headers: { "Content-Type": contentType },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 0),
        );
        setUploadProgress(percentCompleted);
      },
    });

    setUploading(false);
  };

  // Store blob reference
  const blobRef = useRef<Blob | null>(null);

  const handleUpload = (blob: Blob) => {
    blobRef.current = blob;
    setUploading(true);
    setUploadProgress(0);
    getUploadURL({ folderName: "endorsements" });
  };

  return { uploadInterview: handleUpload, uploading, uploadProgress };
};

export default useInterviewUpload;
