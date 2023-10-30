import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage/homepage";
import AboutPage from "./pages/About/about";
import ContactPage from "./pages/Contact/contact";
import Navbar from "./components/navbar";
import SignUpForm from "./pages/Signup/signup";
import LoginPage from "./pages/Login/login";
import { SidebarProvider, SidebarContext } from "./core/sidebar";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Use your color
    },
    // ...you can customize other colors as well
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SidebarProvider>
          <Navbar></Navbar>
        </SidebarProvider>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
