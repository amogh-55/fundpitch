import { Suspense } from "react";
import FundPitchWrapper from "./_components/FundPitchWrapper";

export default function CompanyOverviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FundPitchWrapper />
    </Suspense>
  );
}
