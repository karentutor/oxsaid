import CreateBusinessMain from "@/components/dashboard/create-business/CreateBusinessMain";
import BusinessMain from "@/components/dashboard/business_old/BusinessMain";

export default function Business() {
  return (
    <main className="pt-4 grid gap-6 two-column-grid">
      <CreateBusinessMain />
      <BusinessMain />
    </main>
  );
}
