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
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
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
  backgroundColor: "#323850",
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: 1200,
  "& .MuiDrawer-paper": {
    backgroundColor: "#333740",
    color: "#e0e3e9",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  zIndex: 1200,
}));

const StyledDrawerContent = styled("div")(({ theme }) => ({
  marginTop: "70px",
  "& .MuiDrawer-paper": {
    backgroundColor: "#333740",
    color: "#e0e3e9",
  },
}));
function Navbar() {
  const theme = useTheme();
  const { isSidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const { user, logout } = useAuth();
  const [isPlusIcon, setIsPlusIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const colorMode = useContext(ColorModeContext); // Access the color mode context

  const toggleDrawer = () => {
    setSidebarOpen(!isSidebarOpen);
    setIsPlusIcon(!isPlusIcon);
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{
              color: "#c6aa60",
              fontSize: "20px",
            }}
          >
            {isPlusIcon ? (
              <ArrowBackIosIcon fontSize="inherit" />
            ) : (
              <MenuIcon fontSize="inherit" />
            )}
          </IconButton>

          <div
            style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
          >
            {user ? (
              <Link
                to="/dashboard"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src="/logos/Schrift.png"
                  alt="Schrift"
                  style={{ maxWidth: "250px", maxHeight: "100%" }}
                />
              </Link>
            ) : (
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <img
                  src="/logos/Schrift.png"
                  alt="Schrift"
                  style={{ maxWidth: "250px", maxHeight: "100%" }}
                />
              </Link>
            )}
          </div>
          <div>
            {user ? (
              <div>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
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
                  sx={{
                    marginTop: 7,
                  }}
                >
                  <StyledMenuItem
                    onClick={handleProfileMenuClose}
                    component={Link}
                    to="/profile"
                  >
                    {user.firstname} {user.surname}
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={handleLogout}
                    component={Link}
                    to="/"
                  >
                    Logout
                  </StyledMenuItem>
                </Menu>
              </div>
            ) : (
              <>
                <NavButtons text="Signup" path="/signup"></NavButtons>
                <NavButtons text="Login" path="/login"></NavButtons>
              </>
            )}
          </div>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer anchor="left" open={isSidebarOpen} onClose={toggleDrawer}>
        <StyledDrawerContent
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          {user ? (
            <>
              <StyledListItem
                href="/dashboard"
                primary="Dashboard"
                icon={<BarChartIcon />}
              />
              <StyledListItem
                href="/finance"
                primary="Finanzverwaltung"
                icon={<AccountBalanceWalletIcon />}
              />
              <StyledListItem
                href="/fixed"
                primary="Fixkosten"
                icon={<AttachMoneyIcon />}
              />
              <StyledListItem
                href="/saving"
                primary="Sparziele"
                icon={<SavingsIcon />}
              />
              <StyledListItem
                href="/profile"
                primary="Profil"
                icon={<PersonIcon />}
              />
              <Divider
                sx={{
                  mt: 1,
                  backgroundColor: "#be9e44",
                }}
              />
            </>
          ) : (
            <></>
          )}
          <List>
            <StyledListItem href="/" primary="Home" icon={<HomeIcon />} />
            <StyledListItem
              href="/impressum"
              primary="Impressum"
              icon={<InfoIcon />}
            />
            {/* Additional items here */}
            <Divider />
          </List>
        </StyledDrawerContent>
      </StyledDrawer>
    </div>
  );
}

export default Navbar;
