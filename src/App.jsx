import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Layout from "./components/Layout";

import Business from "./pages/business";
import ChangePassword from "./pages/profile/change-password";
import Contact from "./pages/contact";
import Events from "./pages/events";
import Fundnig from "./pages/fundnig";
import Groups from "./pages/groups";
import Home from "./pages/home";
import User from "./pages/user";
import Jobs from "./pages/jobs";
import Join from "./pages/auth/join";
import Landing from "./pages/landing";
import Messages from "./pages/messages";
import ProfileBusiness from "./pages/profile/business";
import ProfileConnectionList from "./pages/profile/connection-list";
import ProfileEvents from "./pages/profile/events";
import ProfileGroups from "./pages/profile/groups";
import ProfileJobs from "./pages/profile/jobs";
import ProfileLayout from "./pages/profile/layout";
import ProfilePosts from "./pages/profile/posts";
import Register from "./pages/auth/register";
import Search from "./pages/search";
import Signin from "./pages/auth/signin";
import UpdateProfile from "./pages/profile/update-profile";


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
          <Route path="/user" element={<User />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/search" element={<Search />} />
            <Route path="/events" element={<Events />} />
            <Route path="/funding" element={<Fundnig />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/business" element={<Business />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/profile/:id" element={<ProfileLayout />}>
              <Route index element={<ProfilePosts />} />
              <Route path="/profile/:id/posts" element={<ProfilePosts />} />
              <Route path="/profile/:id/jobs" element={<ProfileJobs />} />
              <Route
                path="/profile/:id/connection-list"
                element={<ProfileConnectionList />}
              />
              <Route
                path="/profile/:id/business"
                element={<ProfileBusiness />}
              />
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
          </Route>
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
