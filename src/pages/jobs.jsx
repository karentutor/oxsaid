import AllJobs from "@/components/dashboard/AllJobs";
import PostJob from "@/components/dashboard/PostJob";

export default function Jobs() {
  return (
    <main className="pt-4 grid gap-6 two-column-grid">
      <PostJob />
      <AllJobs />
    </main>
  );
}
