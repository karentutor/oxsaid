import AllFundings from "@/components/dashboard/AllFundings";
import FundingForms from "@/components/dashboard/FundingForms";

export default function Fundnig() {
  return (
    <main className="pt-4 grid gap-6 two-column-grid">
      <FundingForms />
      <AllFundings />
    </main>
  );
}
