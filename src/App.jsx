import CssBaseline from "@mui/material/CssBaseline"
import React from 'react';
import { Routes, Route } from 'react-router-dom'
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

const routes = {
  public: [
    { path: "/", element: <LandingPage /> },
    { path: "/register", element: <RegisterForm /> },
    { path: "/login", element: <LoginForm /> },
    { path: "/donate", element: <DonationForm /> },
    { path: "/donate-item", element: <DonateItem /> },
    { path: "/about", element: <About /> },
    { path: "/work", element: <Works /> },
    { path: "/contact", element: <Contact /> },
    { path: "/faqs", element: <FAQ /> },
    { path: "/reset-password/:token", element: <ResetPassword /> },
    { path: "/auth/callback", element: <GoogleCallback /> },
  ],
  user: [
    { path: "/user/profile", element: <Profile /> },
    { path: "/user/dash", element: <Dashboard /> },
  ],
  admin: [
    { path: "/admin/dash", element: <AdminDashboard /> },
    { path: "/admin/general", element: <General /> },
  ]
};

function App() {
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