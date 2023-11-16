import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import { SidebarProvider } from "./core/sidebar";
import { createTheme } from "@mui/material/styles";
import { AuthProvider } from "./core/auth/auth";
import {
  Dashboard,
  Home,
  Login,
  Profile,
  Signup,
  Contact,
  Impressum,
  Settings,
  FinancePage,
  Reset,
  Saving,
  About,
} from "./pages";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#3A415C",
//     },
//     button: {
//       main: "#4E577B",
//     },
//     text: {
//       main: "#e0e3e9",
//     },
//     input: {
//       main: "#2e2e38",
//     },
//     navicons: {
//       main: "#c6aa60",
//     },
//     background: {
//       default: "#000000",
//     },
//   },
// });
function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <SidebarProvider>
              <Navbar></Navbar>
            </SidebarProvider>
            <div
              style={{
                backgroundColor: "#3b3d49",
                color: "#e0e3e9",
                minHeight: "100vh",
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
                <Route path="/settings" element={<Settings />} />
                <Route path="/password-reset" element={<Reset />} />
                <Route path="/saving" element={<Saving />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
