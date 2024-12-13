import CssBaseline from "@mui/material/CssBaseline"
import React from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from "./pages/Landing";
import RegisterForm from "./pages/user/Registration";

function App() {

  return (
    <React.Fragment>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/register"
          element={<RegisterForm />}
        />
      </Routes>
    </React.Fragment>
  )
}

export default App;