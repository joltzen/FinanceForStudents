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
  CombinedFinanceComponent,
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
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/finance" element={<CombinedFinanceComponent />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
