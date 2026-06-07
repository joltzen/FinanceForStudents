/* Copyright (c) 2026, Jason Oltzen */

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SavingsIcon from "@mui/icons-material/Savings";
import StarIcon from "@mui/icons-material/Star";
import { Box, Divider, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../core/auth/auth";
import { SidebarContext } from "../core/sidebar";

const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 64;

const NAV_ITEMS = [
  {
    href: "/dashboard",
    icon: <BarChartIcon fontSize="small" />,
    label: "Dashboard",
  },
  {
    href: "/finance",
    icon: <AccountBalanceWalletIcon fontSize="small" />,
    label: "Finanzen",
  },
  {
    href: "/fixed",
    icon: <AttachMoneyIcon fontSize="small" />,
    label: "Fixkosten",
  },
  {
    href: "/saving",
    icon: <SavingsIcon fontSize="small" />,
    label: "Sparziele",
  },
  {
    href: "/favorites",
    icon: <StarIcon fontSize="small" />,
    label: "Favoriten",
  },
  { href: "/profile", icon: <PersonIcon fontSize="small" />, label: "Profil" },
];

function SidebarItem({ href, icon, label, isExpanded }) {
  const isActive = window.location.pathname === href;

  const inner = (
    <Box
      component="a"
      href={href}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: isExpanded ? "flex-start" : "center",
        gap: 1.5,
        px: isExpanded ? 2 : 0,
        py: 1,
        mx: 0.75,
        mb: 0.25,
        borderRadius: 2,
        textDecoration: "none",
        minHeight: 42,
        overflow: "hidden",
        whiteSpace: "nowrap",
        color: isActive ? "#e0e3e9" : "rgba(224,227,233,0.55)",
        backgroundColor: isActive ? "rgba(198,170,96,0.14)" : "transparent",
        borderLeft: isExpanded
          ? isActive
            ? "3px solid #c6aa60"
            : "3px solid transparent"
          : "none",
        transition: "background-color 0.15s, color 0.15s",
        "&:hover": {
          backgroundColor: "rgba(198,170,96,0.09)",
          color: "#e0e3e9",
        },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          color: isActive ? "#c6aa60" : "inherit",
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography
        component="span"
        sx={{
          fontSize: "0.875rem",
          fontWeight: isActive ? 600 : 400,
          opacity: isExpanded ? 1 : 0,
          maxWidth: isExpanded ? 200 : 0,
          overflow: "hidden",
          transition: "opacity 0.18s, max-width 0.18s",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  return (
    <Tooltip title={isExpanded ? "" : label} placement="right" arrow>
      {inner}
    </Tooltip>
  );
}

function AppSidebar() {
  const theme = useTheme();
  const { isSidebarOpen: isExpanded } = useContext(SidebarContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const bg = isDark ? "#1c2135" : "#3a415c";
  const width = isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 48,
          left: 0,
          width,
          height: "calc(100vh - 48px)",
          transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
          backgroundColor: bg,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: "auto",
          borderRight: `1px solid rgba(255,255,255,0.05)`,
          boxShadow: "3px 0 12px rgba(0,0,0,0.2)",
          zIndex: 1100,
        }}
      >
        {/* Navigation items */}
        <Box sx={{ flex: 1, pt: 1.5 }}>
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.href} {...item} isExpanded={isExpanded} />
          ))}
        </Box>

        {/* Bottom section */}
        <Divider
          sx={{ borderColor: "rgba(198,170,96,0.15)", mx: 1, my: 0.5 }}
        />
        <SidebarItem
          href="/impressum"
          icon={<InfoIcon fontSize="small" />}
          label="Impressum"
          isExpanded={isExpanded}
        />

        {/* Logout */}
        <Box sx={{ p: 0.75, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Tooltip title={isExpanded ? "" : "Logout"} placement="right">
            <Box
              onClick={handleLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isExpanded ? "flex-start" : "center",
                gap: 1.5,
                px: isExpanded ? 2 : 0,
                py: 1,
                mx: 0.75,
                borderRadius: 2,
                cursor: "pointer",
                color: "rgba(239,83,80,0.6)",
                transition: "background-color 0.15s, color 0.15s",
                "&:hover": {
                  backgroundColor: "rgba(239,83,80,0.1)",
                  color: "#ef5350",
                },
              }}
            >
              <LogoutIcon sx={{ fontSize: 18, flexShrink: 0 }} />
              <Typography
                component="span"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  opacity: isExpanded ? 1 : 0,
                  maxWidth: isExpanded ? 200 : 0,
                  overflow: "hidden",
                  transition: "opacity 0.18s, max-width 0.18s",
                  whiteSpace: "nowrap",
                }}
              >
                Logout
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

export default AppSidebar;
