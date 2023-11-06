import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import { SidebarProvider } from "./core/sidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./core/auth/auth";
import {
  Dashboard,
  Home,
  Login,
  Profile,
  Signup,
  Contact,
  About,
  Settings,
  FinancePage,
} from "./pages";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "white",
          },
          "& label": {
            color: "white",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "white",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#4e577b",
    },
    background: {
      default: "#000000",
    },
  },
});
function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <SidebarProvider>
            <Navbar></Navbar>
          </SidebarProvider>
          <div
            style={{
              backgroundColor: "#333740",
              color: "white",
              minHeight: "100vh",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
