import ProductsForm from "./form";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";

const Products = async () => {
  const products = await api.company.getProducts();

  return (
    <ProductsForm
      products={products}
      revalidateRoute={async () => {
        "use server";
        revalidatePath("/company/account-setup/products");
      }}
    />
  );
};

export default Products;
