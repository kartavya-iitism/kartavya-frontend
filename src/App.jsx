import CssBaseline from "@mui/material/CssBaseline"
import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from "./pages/Landing";
import RegisterForm from "./pages/user/Registration";
import AdminLoginForm from "./pages/admin/Login";
import UserLoginForm from "./pages/user/Login";
import Navbar from "./components/Navbar"

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
          path="/admin/login"
          element={<AdminLoginForm />}
        />

        <Route
          path="/user/login"
          element={<UserLoginForm />}
        />
      </Routes>
    </React.Fragment>
  )
}

export default App;