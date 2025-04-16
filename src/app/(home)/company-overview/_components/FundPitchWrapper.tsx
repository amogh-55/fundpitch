"use client";
import { useSearchParams } from "next/navigation";
import FundPitch from "./FundPitch";
import NotFound from "./not-found";
export default function FundPitchWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <NotFound />;
  }

  return <FundPitch id={id} />;
}
