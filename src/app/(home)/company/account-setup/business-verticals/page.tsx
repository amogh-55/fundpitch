import BusinessVerticalForm from "./form";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
const BusinessVertical = async () => {
  const businessVertical = await api.company.getBusinessVertical();
  return (
    <BusinessVerticalForm
      businessVertical={businessVertical}
      revalidateRoute={async () => {
        "use server";
        revalidatePath("/company/account-setup/business-verticals");
      }}
    />
  );
};

export default BusinessVertical;
