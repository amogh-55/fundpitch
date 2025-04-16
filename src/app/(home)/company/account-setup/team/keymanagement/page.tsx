import KeyManagementForm from "./form";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
const KeyManagement = async () => {
  const data = await api.company.getKeyManagament();
  return (
    <KeyManagementForm
      keyManagament={data}
      revalidateRoute={async () => {
        "use server";
        revalidatePath("/company/account-setup/team/keymanagement");
      }}
    />
  );
};
export default KeyManagement;
