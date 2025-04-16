"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChartBig,
  Briefcase,
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  User,
  UserCircle,
  UserCircle2,
  UserRound,
  X,
} from "lucide-react";

interface ProductDetail {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  photo: string | null;
  about: string | null;
  nameOfTheProduct: string | null;
  productType: string | null;
}

const ProductContent = () => {
  const {
    data: productsDetails,
    isLoading,
    error,
  } = api.company.getProductsDetails.useQuery();
  const [selectedProduct, setSelectedProduct] = useState<
    ProductDetail | undefined
  >(undefined);

  useEffect(() => {
    if (productsDetails?.length) {
      setSelectedProduct(productsDetails[0]);
    }
  }, [productsDetails]);

  if (isLoading) {
    return <div className="mt-6 p-6">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="mt-6 p-6 text-red-500">
        Error loading products: {error.message}
      </div>
    );
  }

  if (!productsDetails?.length) {
    return <div className="mt-6 p-6">No products available.</div>;
  }

  return (
    <div className="mt-6 flex h-[calc(100vh-6rem)] flex-col gap-6 rounded-t-[45px] bg-[#40C3F3] shadow-lg md:flex-row">
      <div className="w-full p-6 md:w-1/3">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Company Products
        </h2>
        <div className="space-y-4">
          {productsDetails?.map((product) => (
            <Card
              key={product.id}
              className={`relative flex items-center rounded-[20px] bg-white p-4 shadow-md transition hover:shadow-lg ${
                selectedProduct?.id === product.id
                  ? "border-2 border-[#40C3F3]"
                  : ""
              }`}
            >
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[12px] bg-[#2388FF] font-bold text-white">
                <img
                  src={product.photo ?? "/placeholder-product.png"}
                  alt={`Product image for ${product.nameOfTheProduct}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="ml-4 flex flex-grow flex-col">
                <h3 className="text-sm font-bold text-gray-900">
                  {product.nameOfTheProduct ?? "Unnamed Product"}
                </h3>
                <span className="mt-1 text-xs text-gray-500">
                  {product.productType ?? "No type specified"}
                </span>
              </div>

              <button
                onClick={() => setSelectedProduct(product)}
                aria-label={`View details for ${product.nameOfTheProduct}`}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#40C3F3] text-white transition-colors hover:bg-[#40a2f3fd]"
              >
                →
              </button>
            </Card>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="relative w-full rounded-t-[45px] bg-white p-6 md:w-2/3">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 overflow-hidden rounded-lg">
                <img
                  src={selectedProduct.photo ?? "/placeholder-product.png"}
                  alt={selectedProduct.nameOfTheProduct ?? "Product"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedProduct.nameOfTheProduct ?? "Unnamed Product"}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedProduct.productType ?? "No type specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700">
                About Product
              </h4>
              <Card className="mt-2 border-none bg-[#F6F8FC] p-4 shadow-none">
                <p className="text-sm leading-relaxed text-[#5D6481]">
                  {selectedProduct.about ?? "No description available"}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium">
                  {selectedProduct.createdAt
                    ? new Date(selectedProduct.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">
                  {selectedProduct.updatedAt
                    ? new Date(selectedProduct.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductContent;
