import BusinessForm from "@/components/dashboard/BusinessForm";
import BusinessMain from "@/components/dashboard/BusinessMain";
import MyBusiness from "@/components/dashboard/MyBusiness";

export default function Business() {
  return (
    <main className="pt-4 grid gap-6 index-grid">
      <BusinessForm />
      <BusinessMain />
      <MyBusiness />
    </main>
  );
}
