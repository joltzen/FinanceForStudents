import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  Divider,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { SidebarContext } from "../core/sidebar";
import { styled } from "@mui/system";
import StyledListItem from "./listitem";
import { useAuth } from "../core/auth/auth";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NavButtons from "./navbuttons";

const StyledAppBar = styled(AppBar)({
  zIndex: 1400,
  position: "relative",
});

const StyledDrawer = styled(Drawer)({
  zIndex: 1200,
  "& .MuiDrawer-paper": {
    backgroundColor: "#333740",
    color: "#e0e3e9",
  },
});

const StyledMenuItem = styled(MenuItem)({
  zIndex: 1200,
});

const StyledDrawerContent = styled("div")({
  width: "15vw",
  marginTop: "70px",

  "& .MuiDrawer-paper": {
    backgroundColor: "#333740",
    color: "#e0e3e9",
  },
});

function Navbar() {
  const { isSidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const { user, logout } = useAuth();
  const [isPlusIcon, setIsPlusIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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
        <Toolbar>
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
          <div style={{ flexGrow: 1 }} />
          {user ? (
            <Link
              to="/dashboard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="h1"
                noWrap
                sx={{
                  fontWeight: "bold",
                  fontSize: "25px",
                  color: "#c6aa60",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                FinanceForStudents
              </Typography>
            </Link>
          ) : (
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                variant="h1"
                noWrap
                sx={{
                  fontWeight: "bold",
                  fontSize: "25px",
                  color: "#c6aa60",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                FinanceForStudents
              </Typography>
            </Link>
          )}
          <div style={{ flexGrow: 1 }} />{" "}
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
                  marginTop: 5,
                }}
              >
                <StyledMenuItem
                  onClick={handleProfileMenuClose}
                  component={Link}
                  to="/profile"
                >
                  {user.firstname} {user.surname}
                </StyledMenuItem>
                <StyledMenuItem onClick={handleLogout} component={Link} to="/">
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
              <StyledListItem href="/dashboard" primary="Dashboard" />
              <StyledListItem href="/finance" primary="Finanzverwaltung" />
              <StyledListItem href="/settings" primary="Settings" />
              <StyledListItem href="/profile" primary="Profil" />
              <Divider />
            </>
          ) : (
            <></>
          )}
          <List>
            <StyledListItem href="/" primary="Home" />
            <StyledListItem href="/about" primary="About" />
            <StyledListItem href="/contact" primary="Contact" />
            <Divider />
          </List>
        </StyledDrawerContent>
      </StyledDrawer>
    </div>
  );
}

export default Navbar;
