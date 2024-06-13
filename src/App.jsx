import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/home";
import Jobs from "./pages/jobs";
import Events from "./pages/events";
import Search from "./pages/search";
import Groups from "./pages/groups";
import Fundnig from "./pages/fundnig";
import Landing from "./pages/landing";
import Messages from "./pages/messages";
import Business from "./pages/business";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <div className="font-rubik">
      <Router>
        <Routes>
          {/* Landing page (Login) */}
          <Route path="/" element={<Landing />} />

          {/* Dashboard */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/search" element={<Search />} />
            <Route path="/events" element={<Events />} />
            <Route path="/funding" element={<Fundnig />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/business" element={<Business />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}
