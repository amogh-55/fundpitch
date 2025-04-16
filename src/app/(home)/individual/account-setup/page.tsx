import IndividualForm from "./form";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

const AccountSetup = async () => {
  const [individualDetails, individualDocuments, user] = await Promise.all([
    api.individual.getIndividualDetails(),
    api.individual.getIndividualDocuments(),
    api.user.getUser()
  ]);



  return (
    <IndividualForm
      individualDetails={individualDetails}
      user={user}
      individualDocuments={individualDocuments}
      revalidateRoute={async () => {
        "use server";
        revalidatePath("/individual/account-setup");
      }}
    />
  );
};

export default AccountSetup;
