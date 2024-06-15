import AllEvents from "@/components/dashboard/AllEvents";
import CreateEvent from "@/components/dashboard/CreateEvent";

export default function Events() {
  return (
    <main className="pt-4 grid gap-6 two-column-grid">
      <CreateEvent />
      <AllEvents />
    </main>
  );
}
