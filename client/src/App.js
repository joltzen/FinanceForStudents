import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import Navbar from "./components/navbar";
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
    <SidebarProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <SidebarProvider>
            <Navbar></Navbar>
          </SidebarProvider>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </SidebarProvider>
  );
}

export default App;
