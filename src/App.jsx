import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context"; 
import AuthenticatedRoute from "@/components/auth/AuthenticatedRoute"; 
import PublicRoute from "@/components/auth/PublicRoute"; 
import Business from "./pages/businesses";
import ChangePassword from "./pages/change-password";
import Contact from "./pages/contact";
import Events from "./pages/events";
import Funding from "./pages/funding"; // Fixed typo: Fundnig -> Funding
import Groups from "./pages/groups";
import Home from "./pages/home";
import Jobs from "./pages/jobs";
import Join from "./pages/auth/join";
import Landing from "./pages/landing";
import Layout from "./components/Layout";
import Messages from "./pages/messages";
import NotFound from "./pages/not-found";
import Register from "./pages/auth/register";
import Search from "./pages/search";
import Settings from "./pages/settings";
import Signin from "./pages/auth/signin";
import UpdateProfile from "./pages/update-profile";
import UserSearch from "./pages/user-search";

export default function App() {
  return (
    <AuthProvider>
      <div className="font-rubik">
        <Router>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Landing />} />
              <Route path="/join" element={<Join />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<Signin />} />
            </Route>

            {/* Protected routes */}
            <Route element={<AuthenticatedRoute />}>
              <Route element={<Layout />}>
                <Route path="/businesses" element={<Business />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/events" element={<Events />} />
                <Route path="/funding" element={<Funding />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/home" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/user-search" element={<UserSearch />} />
                <Route path="/profile/:id" element={<Home />} />
              </Route>
            </Route>

            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster richColors closeButton position="bottom-right" />
      </div>
    </AuthProvider>
  );
}
