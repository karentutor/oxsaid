import { Outlet } from "react-router-dom";
import Header from "./dashboard/Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <Outlet />
    </div>
  );
}
