import { api } from "@/trpc/server";
import BoardOfDirectorForm from "./form";
import { revalidatePath } from "next/cache";
const BoardOfDirectors = async () => {
  const data = await api.company.getBoardOfDirectors();

  return (
    <BoardOfDirectorForm
      boardOfDirectors={data}
      revalidateRoute={async () => {
        "use server";
        revalidatePath("/company/account-setup/team/boardofdirectors");
      }}
    />
  );
};

export default BoardOfDirectors;
