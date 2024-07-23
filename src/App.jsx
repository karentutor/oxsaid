import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context"; // Ensure correct import path for AuthProvider

import AuthenticatedRoute from "@/components/auth/AuthenticatedRoute"; // Correct import path
import Business from "./pages/business";
import ChangePassword from "./pages/change-password";
import Contact from "./pages/contact";
import Events from "./pages/events";
import EditBusiness from "./pages/edit-business";
import Funding from "./pages/funding"; // Fixed typo: Fundnig -> Funding
import Groups from "./pages/groups";
import Home from "./pages/home";
import Jobs from "./pages/jobs";
import Join from "./pages/auth/join";
import Landing from "./pages/landing";
import Layout from "./components/Layout";
import Messages from "./pages/messages";
import NotFound from "./pages/not-found";
// import ProfileBusiness from "./pages/own-profile/business";
// import ProfileConnectionList from "./pages/own-profile/connection-list";
// import ProfileEvents from "./pages/own-profile/events";
// import ProfileGroups from "./pages/own-profile/groups";
// import ProfileJobs from "./pages/own-profile/jobs";
// import ProfileLayout from "./pages/own-profile/layout";
// import ProfilePosts from "./pages/own-profile/posts";
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
            <Route path="/" element={<Landing />} />
            <Route path="/join" element={<Join />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Signin />} />

            {/* Protected routes */}
            <Route element={<AuthenticatedRoute />}>
              <Route element={<Layout />}>
                           
                {/* Authenticated User Profile */}
                <Route path="/business" element={<Business />} />
                <Route path="/change-password" element={<ChangePassword />} />
                {/* <Route path="/connection-list" element={<ProfileConnectionList />} /> */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/events" element={<Events />} />
                <Route path="/edit-business/:id" element={<EditBusiness />} />
                <Route path="/edit-business/:id" element={<EditBusiness />} />
                <Route path="/edit-business" element={<Navigate to="/home" />} /> {/* Redirect if no ID */}
                <Route path="/funding" element={<Funding />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/home" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                {/* <Route path="/messages" element={<Messages />} />
                <Route path="/search" element={<Search />} /> */}
                <Route path="/settings" element={<Settings />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/user-search" element={<UserSearch />} />

 
                <Route path="/" element={<Home />} />
                {/* <Route path="/business" element={<ProfileBusiness />} /> */}

                {/* <Route path="/events" element={<ProfileEvents />} />
                <Route path="/groups" element={<ProfileGroups />} />
                <Route path="/jobs" element={<ProfileJobs />} /> */}
                {/* <Route path="/posts" element={<ProfilePosts />} /> */}

                {/* Other Users' Profiles */}
                <Route path="/profile/:id" element={<Home />} />
                {/* <Route path="/profile/:id/business" element={<ProfileBusiness />} />
                <Route path="/profile/:id/connection-list" element={<ProfileConnectionList />} />
                <Route path="/profile/:id/events" element={<ProfileEvents />} />
                <Route path="/profile/:id/groups" element={<ProfileGroups />} />
                <Route path="/profile/:id/jobs" element={<ProfileJobs />} />
                <Route path="/profile/:id/posts" element={<ProfilePosts />} /> */}
              </Route>
            </Route>

            {/* Catch-all route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster
          richColors
          closeButton
          position="bottom-right"
        />
      </div>
    </AuthProvider>
  );
}
