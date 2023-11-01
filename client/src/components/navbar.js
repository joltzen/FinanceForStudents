import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  Divider,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { SidebarContext } from "../core/sidebar";
import { styled } from "@mui/system";
import StyledListItem from "./listitem";
import { useAuth } from "../core/auth/auth";
import { Link } from "react-router-dom"; // Hier importiert
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";

const StyledAppBar = styled(AppBar)({
  zIndex: 1400,
  position: "relative",
});

const StyledDrawer = styled(Drawer)({
  zIndex: 1200,
  "& .MuiDrawer-paper": {
    // Targeting the inner paper component of Drawer
    backgroundColor: "#333740", // Your desired background color for the sidebar
    color: "white",
    // If you also want to change the text color
  },
});

const StyledMenuItem = styled(MenuItem)({
  zIndex: 1200,
  fontSize: "1.4rem",
});

const StyledDrawerContent = styled("div")({
  width: "250px",
  marginTop: "70px",
  "& .MuiDrawer-paper": {
    // Targeting the inner paper component of Drawer
    backgroundColor: "#333740", // Your desired background color for the sidebar
    color: "white", // If you also want to change the text color
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
            sx={{ color: "#d8c690" }}
          >
            {isPlusIcon ? (
              <ArrowBackIosIcon sx={{ fontSize: "2rem" }} />
            ) : (
              <MenuIcon sx={{ fontSize: "2rem" }} />
            )}
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: "bold",
                fontSize: "35px",
                color: "#cbb264",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              FinanceForStudents
            </Typography>
          </Link>
          <div style={{ flexGrow: 1 }} />{" "}
          {user ? (
            <div>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ color: "#d8c690" }}
              >
                <AccountCircle sx={{ fontSize: "2rem" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                sx={{
                  fontSize: "1.5rem", // Increase the font size#
                  marginTop: 5,
                }}
              >
                <StyledMenuItem
                  onClick={handleProfileMenuClose}
                  component={Link}
                  to="/profile"
                >
                  {user.username}
                </StyledMenuItem>
                <StyledMenuItem onClick={handleLogout} component={Link} to="/">
                  Logout
                </StyledMenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button color="inherit" href="/signup" sx={{ color: "#d8c690" }}>
                Signup
              </Button>
              <Button color="inherit" href="/login" sx={{ color: "#d8c690" }}>
                Login
              </Button>
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
          <List>
            <StyledListItem href="/" primary="Home" />
            <StyledListItem href="/about" primary="About" />
            <StyledListItem href="/contact" primary="Contact" />
            <Divider />
            {user ? (
              <StyledListItem href="/profile" primary="Profile" />
            ) : (
              <></>
            )}
          </List>
        </StyledDrawerContent>
      </StyledDrawer>
    </div>
  );
}

export default Navbar;
