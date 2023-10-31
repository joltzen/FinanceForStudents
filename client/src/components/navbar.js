import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  Divider,
  Button,
  Typography, // Import Button from MUI
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { SidebarContext } from "../core/sidebar";
import { styled } from "@mui/system";
import StyledListItem from "./listitem";
import { useAuth } from "../core/auth/auth";

const StyledAppBar = styled(AppBar)({
  zIndex: 1400,
  position: "relative",
});

const StyledDrawer = styled(Drawer)({
  zIndex: 1200,
});

const StyledDrawerContent = styled("div")({
  width: "250px",
  marginTop: "70px",
});

function Navbar() {
  const { isSidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const { user, logout } = useAuth();
  const [isPlusIcon, setIsPlusIcon] = useState(false);

  const navColor = "#cbb264";
  const toggleDrawer = () => {
    setSidebarOpen(!isSidebarOpen);
    setIsPlusIcon(!isPlusIcon);
  };

  const handleLogout = () => {
    logout();
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
            {isPlusIcon ? <ArrowBackIosIcon /> : <MenuIcon />}
          </IconButton>
          <div style={{ flexGrow: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: "bold", fontSize: "35px", color: "#cbb264" }}
          >
            FinanceForStudents
          </Typography>
          <div style={{ flexGrow: 1 }} />{" "}
          {user ? (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ color: "#d8c690" }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" href="/signup">
                Signup
              </Button>
              <Button color="inherit" href="/login">
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
              <>
                <StyledListItem href="/signup" primary="Signup" />
                <StyledListItem href="/login" primary="Login" />
              </>
            )}
          </List>
        </StyledDrawerContent>
      </StyledDrawer>
    </div>
  );
}

export default Navbar;
