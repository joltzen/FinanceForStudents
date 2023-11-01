import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage/homepage";
import AboutPage from "./pages/About/about";
import ContactPage from "./pages/Contact/contact";
import Navbar from "./components/navbar";
import SignUpForm from "./pages/Signup/signup";
import LoginPage from "./pages/Login/login";
import ProfilePage from "./pages/Profile/profile";
import { SidebarProvider, SidebarContext } from "./core/sidebar";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { AuthProvider } from "./core/auth/auth";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "white",
          },
          "& label": {
            color: "white", // Normal state
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
      main: "#4e577b", // Use your color
    },
    background: {
      default: "#000000", // Your desired background color
    },
    // ...you can customize other colors as well
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
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
