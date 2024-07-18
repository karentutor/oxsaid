import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Layout from "./components/Layout";
import Business from "./pages/business";
import ChangePassword from "./pages/own-profile/change-password";
import Contact from "./pages/contact";
import Events from "./pages/events";
import Fundnig from "./pages/fundnig";
import Groups from "./pages/groups";
import Home from "./pages/home";
import UserSearch from "./pages/user-search";
import Jobs from "./pages/jobs";
import Join from "./pages/auth/join";
import Landing from "./pages/landing";
import Messages from "./pages/messages";
import NotFound from "./pages/not-found";
import ProfileBusiness from "./pages/own-profile/business";
import ProfileConnectionList from "./pages/own-profile/connection-list";
import ProfileEvents from "./pages/own-profile/events";
import ProfileGroups from "./pages/own-profile/groups";
import ProfileJobs from "./pages/own-profile/jobs";
import ProfileLayout from "./pages/own-profile/layout";
import ProfilePosts from "./pages/own-profile/posts";
import Register from "./pages/auth/register";
import Search from "./pages/search";
import Signin from "./pages/auth/signin";
import UpdateProfile from "./pages/own-profile/update-profile";

export default function App() {
  return (
    <div className="font-rubik">
      <Router>
        <Routes>
          {/* Landing page (Login) */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join" element={<Join />} />

          {/* Dashboard */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/user-search" element={<UserSearch />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/search" element={<Search />} />
            <Route path="/events" element={<Events />} />
            <Route path="/funding" element={<Fundnig />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/business" element={<Business />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/profile/:id" element={<Home />} />
            <Route path="/profile/:id/posts" element={<ProfilePosts />} />
            <Route path="/profile/:id/jobs" element={<ProfileJobs />} />
            <Route
              path="/profile/:id/connection-list"
              element={<ProfileConnectionList />}
            />
            <Route path="/profile/:id/business" element={<ProfileBusiness />} />
            <Route path="/profile/:id/events" element={<ProfileEvents />} />
            <Route path="/profile/:id/groups" element={<ProfileGroups />} />
            <Route
              path="/profile/:id/update-profile"
              element={<UpdateProfile />}
            />
            <Route
              path="/profile/:id/change-password"
              element={<ChangePassword />}
            />
          </Route>
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster
        richColors
        closeButton
        position="top-right" // Set position to top-right
      />
    </div>
  );
}
