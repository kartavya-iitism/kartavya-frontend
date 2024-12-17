import CssBaseline from "@mui/material/CssBaseline"
import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from "./pages/Landing";
import RegisterForm from "./pages/user/Registration";
import LoginForm from "./pages/Login";
import Navbar from "./components/Navbar"
import Profile from "./pages/user/Profile"
import DonationForm from "./pages/Donate";

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
          path="/user/register"
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
    </React.Fragment>
  )
}

export default App;