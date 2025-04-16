import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

const useDelete = ({ callback }: { callback?: () => void }) => {
  const { mutateAsync, isPending } = api.user.deleteImage.useMutation({
    onSuccess(data) {
      if (data.success) {
        if (callback) callback();
        toast({
          type: "foreground",
          title: "Deleted successfully",
        });
      } else {
        toast({
          type: "foreground",
          title: data?.error ?? "Error in Deleting",
        });
      }
    },
  });

  const handleDelete = async (url: string) => {
    if (isPending) return;
    const id = url.split("/").pop();
    const folder = url.split("/")[url.split("/").length - 2];

    await mutateAsync({
      fileName: `${folder}/${id}`,
    });
  };

  return { handleDelete, isDeleting: isPending };
};

export default useDelete;
