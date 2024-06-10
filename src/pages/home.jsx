import { Aside } from "@/components/dashboard/Aside";
import { Main } from "@/components/dashboard/Main";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function Home() {
  return (
    <main className="pt-4 grid gap-6" id="index-grid">
      <Sidebar />
      <Main />
      <Aside />
    </main>
  );
}
