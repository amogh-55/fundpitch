import { useState } from "react";
import axios from "axios";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import mime from "mime-types";

const useUpload = ({
  files,
  callback,
}: {
  files: File[] | null;
  callback?: (id: string) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const { mutate: getUploadURL } = api.user.getUploadURL.useMutation({
    onSuccess(data) {
      if (data.success) {
        try {
          const url = data?.uploadParams ?? "";
          const id = data?.id ?? "";

          if (!files || files.length === 0)
            return toast({ title: "No files to upload" });

          void Promise.all(files.map((file) => uploadFile(url, file, id))).then(
            () => {
              if (callback) callback(id);
            },
          );
        } catch (error) {
          setUploading(false);
          toast({
            type: "foreground",
            title: "Error in Uploading",
          });
        }
      } else {
        setUploading(false);
        toast({
          type: "foreground",
          title: data?.error ?? "Error in Uploading",
        });
      }
    },
    onError(error) {
      setUploading(false);
      toast({
        title: error.message ?? "Error in Uploading",
      });
    },
  });

  const uploadFile = async (url: string, file: File, id: string) => {
    try {
      const contentType: string | false = mime.lookup(file.name);

      await axios.put(`${url}`, file, {
        headers: { "Content-Type": contentType ?? "image/png" },
      });

      setUploading(false);
    } catch (error) {
      setUploading(false);
      toast({
        type: "foreground",
        title: "Error in Uploading",
      });
    }
  };

  const handleUpload = ({ folderName }: { folderName: string }) => {
    setUploading(true);
    getUploadURL({ folderName });
  };

  return { handleUpload, uploading };
};

export default useUpload;
