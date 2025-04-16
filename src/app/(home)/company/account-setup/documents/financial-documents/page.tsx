import { api } from "@/trpc/server";
import FinancialDocumentsForm from "./form";
import { revalidatePath } from "next/cache";

const FinancialDocuments = async () => {
  const financialDocs = await api.company.getFinancialDocs();
  return (
    <FinancialDocumentsForm
      financialDocs={financialDocs}
      revalidateRoute={async () => {
        "use server";
        revalidatePath("/company/account-setup/documents/financial-documents");
      }}
    />
  );
};

export default FinancialDocuments;
