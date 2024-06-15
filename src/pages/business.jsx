import BusinessForm from "@/components/dashboard/BusinessForm";
import BusinessMain from "@/components/dashboard/BusinessMain";

export default function Business() {
  return (
    <main className="pt-4 grid gap-6 two-column-grid">
      <BusinessForm />
      <BusinessMain />
    </main>
  );
}
