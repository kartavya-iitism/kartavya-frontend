import CssBaseline from "@mui/material/CssBaseline"
import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from "./pages/Landing/Landing";
import RegisterForm from "./pages/Registration/Registration";
import LoginForm from "./pages/Login/Login";
import Navbar from "./components/Navbar/Navbar"
import Profile from "./pages/user/Profile/Profile"
import DonationForm from "./pages/Donate/Donate";
import Footer from "./components/Footer/Footer";

function App() {

  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/register"
          element={<RegisterForm />}
        />
        <Route
          path="/login"
          element={<LoginForm />}
        />
        <Route
          path="/user/profile"
          element={<Profile />}
        />
        <Route
          path="/donate"
          element={<DonationForm />}
        />
      </Routes>
      <Footer />
    </React.Fragment>
  )
}

export default App;