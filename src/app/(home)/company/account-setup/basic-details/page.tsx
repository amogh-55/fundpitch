import BasicDetailsForm from "./form";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

const BasicDetails = async () => {
  const basicDetails = await api.company.getBasicDetails();

  const user = await api.user.getUser();

  return (
    <BasicDetailsForm
      user={user}
      basicDetails={basicDetails}
      revalidateRoute={async () => {
        "use server";
        revalidatePath("/student/account-setup/basic-details");
      }}
    />
  );
};

export default BasicDetails;
