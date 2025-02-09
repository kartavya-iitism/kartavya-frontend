import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import CssBaseline from "@mui/material/CssBaseline"
import './App.css'

// components
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer";
import GoogleCallback from "./components/GoogleCallBack/GoogleCallBack";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

// helpers
import { UserRoute, AdminRoute } from "./helper/routeProtection";
import { AuthProvider } from './helper/AuthContext';

// user
import Profile from "./pages/user/Profile/Profile"
import Dashboard from "./pages/user/Dashboard/Dashboard"
import ResetPassword from "./pages/user/ResetPassword/ResetPassword";

// public
import LandingPage from "./pages/Landing/Landing";
import RegisterForm from "./pages/Registration/Registration";
import LoginForm from "./pages/Login/Login";
import DonationForm from "./pages/Donate/Donate";
import About from "./pages/About/About";
import Works from "./pages/Works/Works";
import Contact from "./pages/Contact/Contact";
import FAQ from "./pages/FAQ/FAQ";
import DonateItem from "./pages/DonateItem/DonateItem";
import NewsAchievements from "./pages/NewsAchievement/NewsAchievement";

// admin
import AdminDashboard from "./pages/admin/Dashboard/Dashboard";
import General from "./pages/admin/General/General";
import ManageNewsAchievements from "./pages/admin/ManageNewsAchievements/ManageNewsAchievements";

const routes = {
  public: [
    { path: "/", element: <LandingPage />, title: "Home | Kartavya" },
    { path: "/register", element: <RegisterForm />, title: "Register | Kartavya" },
    { path: "/login", element: <LoginForm />, title: "Login | Kartavya" },
    { path: "/donate", element: <DonationForm />, title: "Donate | Kartavya" },
    { path: "/donate-item", element: <DonateItem />, title: "Donate Items | Kartavya" },
    { path: "/about", element: <About />, title: "About Us | Kartavya" },
    { path: "/work", element: <Works />, title: "Our Work | Kartavya" },
    { path: "/contact", element: <Contact />, title: "Contact Us | Kartavya" },
    { path: "/faqs", element: <FAQ />, title: "FAQs | Kartavya" },
    { path: "/news", element: <NewsAchievements />, title: "News & Achievements | Kartavya" },
    { path: "/reset-password/:token", element: <ResetPassword />, title: "Reset Password | Kartavya" },
    { path: "/auth/callback", element: <GoogleCallback />, title: "Authentication | Kartavya" },
  ],
  user: [
    { path: "/user/profile", element: <Profile />, title: "My Profile | Kartavya" },
    { path: "/user/dash", element: <Dashboard />, title: "Dashboard | Kartavya" },
  ],
  admin: [
    { path: "/admin/dash", element: <AdminDashboard />, title: "Admin Dashboard | Kartavya" },
    { path: "/admin/general", element: <General />, title: "General Settings | Kartavya" },
    { path: "/admin/news", element: <ManageNewsAchievements />, title: "General Settings | Kartavya" },
  ]
};

function App() {
  const location = useLocation();

  useEffect(() => {
    const currentRoute = [...routes.public, ...routes.user, ...routes.admin]
      .find(route => route.path === location.pathname);

    document.title = currentRoute?.title || "Kartavya";
  }, [location]);

  return (
    <AuthProvider>
      <React.Fragment>
        <CssBaseline />
        <ScrollToTop />
        <Navbar />
        <Routes>
          {routes.public.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          {routes.user.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<UserRoute>{element}</UserRoute>}
            />
          ))}
          {routes.admin.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<AdminRoute>{element}</AdminRoute>}
            />
          ))}
        </Routes>
        <Footer />
      </React.Fragment>
    </AuthProvider>
  );
}

export default App;