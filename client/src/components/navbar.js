/* Copyright (c) 2026, Jason Oltzen */

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../core/auth/auth";
import { SidebarContext } from "../core/sidebar";
import { ColorModeContext } from "../theme";
import NavButtons from "./navbuttons";

function Navbar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { isSidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const { user, logout } = useAuth();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const navBg = isDark ? "#161b2e" : "#3a415c";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: navBg,
        borderBottom: `1px solid rgba(255,255,255,0.06)`,
        zIndex: 1200,
        height: 48,
        justifyContent: "center",
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 1.5 }}>
        {/* Sidebar toggle — only shown when logged in */}
        {user && (
          <Tooltip title={isSidebarOpen ? "Einklappen" : "Ausklappen"}>
            <IconButton
              size="small"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              sx={{
                color: "rgba(198,170,96,0.7)",
                mr: 1,
                "&:hover": { color: "#c6aa60" },
              }}
            >
              {isSidebarOpen ? (
                <MenuOpenIcon fontSize="small" />
              ) : (
                <MenuIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}

        {/* Logo */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: user ? "flex-start" : "center",
          }}
        >
          <Link
            to={user ? "/dashboard" : "/"}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/logos/Schrift.png"
              alt="FinanceForStudents"
              style={{ height: 28, objectFit: "contain", opacity: 0.92 }}
            />
          </Link>
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
            <IconButton
              size="small"
              onClick={colorMode.toggleColorMode}
              sx={{
                color: "rgba(198,170,96,0.7)",
                "&:hover": { color: "#c6aa60" },
              }}
            >
              {isDark ? (
                <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />
              ) : (
                <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  color: "rgba(198,170,96,0.7)",
                  ml: 0.5,
                  "&:hover": { color: "#c6aa60" },
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 22 }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    backgroundColor: isDark ? "#252a3d" : "#fff",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    minWidth: 160,
                    mt: 0.5,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: isDark ? "#e0e3e9" : "#2c2f36",
                    }}
                  >
                    {user.firstname} {user.surname}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark
                        ? "rgba(224,227,233,0.45)"
                        : "rgba(44,47,54,0.45)",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ opacity: 0.4 }} />
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={() => setAnchorEl(null)}
                  sx={{ fontSize: "0.875rem", py: 1 }}
                >
                  Profil
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    setAnchorEl(null);
                  }}
                  component={Link}
                  to="/"
                  sx={{ fontSize: "0.875rem", py: 1, color: "#ef5350" }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <NavButtons text="Signup" path="/signup" />
              <NavButtons text="Login" path="/login" />
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
