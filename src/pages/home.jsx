import React from "react";

import { Main } from "@/components/dashboard/Main";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function Home() {
  return (
    <main className="pt-4 grid gap-6 index-grid">
     <Sidebar /> 
     <Main /> 
    </main>
  );
}
