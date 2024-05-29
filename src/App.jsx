import { Toaster } from "react-hot-toast";
import {
  Outlet,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";

import Signin from "./pages/auth/signin";
import Register from "./pages/auth/register";

import Home from "./pages/home";
import Jobs from "./pages/jobs";
import Events from "./pages/events";
import Search from "./pages/search";
import Groups from "./pages/groups";
import Fundnig from "./pages/fundnig";
import Messages from "./pages/messages";
import Business from "./pages/business";
import About from "./pages/about";
import Services from "./pages/services";

export default function App() {
  return (
    <div className="font-rubik">
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/search" element={<Search />} />
            <Route path="/events" element={<Events />} />
            <Route path="/funding" element={<Fundnig />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/business" element={<Business />} />

            {/* Protected Routes */}
            {/* <Route element={<RequireAuth allowedRoles={["User"]} />}>
              <Route path="/profile" element={<Profile />} />
            </Route> */}
          </Route>

          <Route element={<Outlet />}>
            <Route path="/signin" element={<Signin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}
