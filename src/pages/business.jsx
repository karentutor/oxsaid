import CreateBusiness from "@/components/dashboard/CreateBusiness";
import BusinessMain from "@/components/dashboard/business/BusinessMain";

export default function Business() {
  return (
    <main className="pt-4 grid gap-6 two-column-grid">
      <CreateBusiness />
      <BusinessMain />
    </main>
  );
}
