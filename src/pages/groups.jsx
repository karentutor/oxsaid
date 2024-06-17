import AllGroups from "@/components/dashboard/AllGroups";
import CreateGroup from "@/components/dashboard/CreateGroup";

export default function Groups() {
  return (
    <main className="pt-4 grid gap-6 two-column-grid">
      <CreateGroup />
      <AllGroups />
    </main>
  );
}
