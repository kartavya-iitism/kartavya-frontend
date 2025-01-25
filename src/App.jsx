import CssBaseline from "@mui/material/CssBaseline"
import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css'
import LandingPage from "./pages/Landing/Landing";
import RegisterForm from "./pages/Registration/Registration";
import LoginForm from "./pages/Login/Login";
import Navbar from "./components/Navbar/Navbar"
import Profile from "./pages/user/Profile/Profile"
import Dashboard from "./pages/user/Dashboard/Dashboard"
import DonationForm from "./pages/Donate/Donate";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/About";
import Works from "./pages/Works/Works";
import Contact from "./pages/Contact/Contact";
import FAQ from "./pages/FAQ/FAQ";
import AdminDashboard from "./pages/admin/Dashboard/Dashboard";
import { UserRoute, AdminRoute } from "./helper/routeProtection";
import General from "./pages/admin/General/General";
import DonateItem from "./pages/DonateItem/DonateItem";
import ResetPassword from "./pages/user/ResetPassword/ResetPassword";
import GoogleCallback from "./components/GoogleCallBack/GoogleCallBack";
import { AuthProvider } from './helper/AuthContext';
import NewsAchievements from "./pages/NewsAchievement/NewsAchievement";
import ManageNewsAchievements from "./pages/admin/ManageNewsAchievements/ManageNewsAchievements";
import Media from "./pages/Media/Media";

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
    { path: "/media", element: <Media />, title: "Media Gallery | Kartavya" },
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