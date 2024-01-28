/* Copyright (c) 2023, Jason Oltzen */

import { ThemeProvider } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import { AuthProvider } from "./core/auth/auth";
import { SidebarProvider } from "./core/sidebar";
import {
  About,
  Admin,
  Contact,
  Dashboard,
  Favorites,
  FinancePage,
  Fixed,
  Home,
  Impressum,
  Login,
  Profile,
  Reset,
  Saving,
  Signup,
} from "./pages";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AuthProvider>
        <Router>
          <SidebarProvider>
            <Navbar></Navbar>
          </SidebarProvider>
          <ThemeProvider theme={theme}>
            <div
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                minHeight: "98vh",
                minWidth: "98vw",
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/fixed" element={<Fixed />} />
                <Route path="/password-reset" element={<Reset />} />
                <Route path="/saving" element={<Saving />} />
                <Route path="/about" element={<About />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
          </ThemeProvider>
        </Router>
      </AuthProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
