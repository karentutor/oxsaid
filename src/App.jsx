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
            <Route path="/funding" element={<Fundnig />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/events" element={<Events />} />
            <Route path="/business" element={<Business />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/search" element={<Search />} />

            {/* Advisor & User Routes */}
            {/* <Route element={<RequireAuth allowedRoles={["Advisor", "User"]} />}>
              <Route
                path="/my-consulting-services"
                element={<MyConsultingServices />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/consulting-services" element={<Consulting />} />
              <Route path="/executive-services" element={<Executive />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<Course />} />
              <Route
                path="/my-executive-services"
                element={<MyExecutiveServices />}
              />
              <Route path="/my-courses" element={<MyCourses />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={["Advisor"]} />}>
              <Route
                path="/my-consulting-order"
                element={<MyConsultingOrder />}
              />
            </Route> */}
          </Route>

          <Route element={<Outlet />}>
            <Route path="/login" element={<Signin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            {/* <Route path="/account/reset-password" element={<ResetPassword />} />
            <Route path="/endorsement" element={<Endorsement />} />
            <Route path="/account/verify-email" element={<Verified />} /> */}
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}
