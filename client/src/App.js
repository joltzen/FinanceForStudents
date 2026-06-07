/* Copyright (c) 2026, Jason Oltzen */

import { Box, ThemeProvider } from "@mui/material";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import AppSidebar from "./components/Sidebar";
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
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <SidebarProvider>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                }}
              >
                {/* Top bar */}
                <Navbar />

                {/* Body: sidebar + content */}
                <Box sx={{ display: "flex", flex: 1 }}>
                  <AppSidebar />

                  {/* Main content */}
                  <Box
                    component="main"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                      overflowX: "hidden",
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
                  </Box>
                </Box>
              </Box>
            </SidebarProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
