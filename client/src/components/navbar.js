/* Copyright (c) 2023, Jason Oltzen */

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SavingsIcon from "@mui/icons-material/Savings";
import StarIcon from "@mui/icons-material/Star";
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../core/auth/auth";
import { SidebarContext } from "../core/sidebar";
import { ColorModeContext } from "../theme";
import StyledListItem from "./listitem";
import NavButtons from "./navbuttons";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: 1400,
  position: "relative",
  backgroundColor: theme.palette.nav.main,
  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: 1200,
  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.mode === "dark" ? "#252a3d" : "#3A415C",
    color: "#e0e3e9",
    borderRight: "none",
    boxShadow: "4px 0 16px rgba(0,0,0,0.3)",
    width: 240,
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px 16px 16px",
  borderBottom: "1px solid rgba(198,170,96,0.25)",
  marginBottom: 8,
}));

const StyledDrawerContent = styled("div")(({ theme }) => ({
  marginTop: "56px",
}));

function Navbar() {
  const theme = useTheme();
  const { isSidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const { user, logout } = useAuth();
  const [isPlusIcon, setIsPlusIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const colorMode = useContext(ColorModeContext);

  const toggleDrawer = () => {
    setSidebarOpen(!isSidebarOpen);
    setIsPlusIcon(!isPlusIcon);
  };

  const handleLogout = () => logout();
  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ color: "#c6aa60", fontSize: "20px" }}
          >
            {isPlusIcon ? (
              <ArrowBackIosIcon fontSize="inherit" />
            ) : (
              <MenuIcon fontSize="inherit" />
            )}
          </IconButton>

          <div style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Link
              to={user ? "/dashboard" : "/"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src="/logos/Schrift.png"
                alt="FinanceForStudents"
                style={{ maxWidth: "220px", maxHeight: "44px", objectFit: "contain" }}
              />
            </Link>
          </div>

          <div>
            {user ? (
              <div>
                <IconButton
                  edge="end"
                  aria-label="account"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  sx={{ color: "#c6aa60", fontSize: "20px" }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  sx={{ marginTop: 7 }}
                  PaperProps={{
                    sx: {
                      backgroundColor: theme.palette.mode === "dark" ? "#252a3d" : "#fff",
                      borderRadius: 2,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                      minWidth: 160,
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleProfileMenuClose}
                    component={Link}
                    to="/profile"
                    sx={{ py: 1.5, fontWeight: 500 }}
                  >
                    {user.firstname} {user.surname}
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={handleLogout}
                    component={Link}
                    to="/"
                    sx={{ py: 1.5, color: "#e57373" }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <>
                <NavButtons text="Signup" path="/signup" />
                <NavButtons text="Login" path="/login" />
              </>
            )}
          </div>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer anchor="left" open={isSidebarOpen} onClose={toggleDrawer}>
        <DrawerHeader>
          <img
            src="/logos/Schrift.png"
            alt="FinanceForStudents"
            style={{ maxWidth: "160px", filter: "brightness(1.1)" }}
          />
        </DrawerHeader>
        <StyledDrawerContent
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          {user ? (
            <>
              <StyledListItem href="/dashboard" primary="Dashboard" icon={<BarChartIcon />} />
              <StyledListItem href="/finance" primary="Finanzen" icon={<AccountBalanceWalletIcon />} />
              <StyledListItem href="/fixed" primary="Fixkosten" icon={<AttachMoneyIcon />} />
              <StyledListItem href="/saving" primary="Sparziele" icon={<SavingsIcon />} />
              <StyledListItem href="/favorites" primary="Favoriten" icon={<StarIcon />} />
              <StyledListItem href="/profile" primary="Profil" icon={<PersonIcon />} />
              <Divider sx={{ mt: 1, backgroundColor: "rgba(198,170,96,0.3)" }} />
            </>
          ) : (
            <StyledListItem href="/" primary="Home" icon={<HomeIcon />} />
          )}
          <List>
            <StyledListItem href="/impressum" primary="Impressum" icon={<InfoIcon />} />
          </List>
        </StyledDrawerContent>
      </StyledDrawer>
    </div>
  );
}

export default Navbar;
