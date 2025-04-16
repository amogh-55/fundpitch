import { api } from "@/trpc/server";
import CorporateDecksForm from "./form";
import { revalidatePath } from "next/cache";
const CorporateDecks = async () => {
  const corporateDecks = await api.company.getCorporateDecks();
  return (
    <CorporateDecksForm
      corporateDecks={corporateDecks}
      revalidateRoute={async () => {
        "use server";
        revalidatePath("/company/account-setup/documents/corporate-decks");
      }}
    />
  );
};

export default CorporateDecks;
