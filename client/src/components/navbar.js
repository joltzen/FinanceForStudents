import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { SidebarContext } from "../core/sidebar";
import { styled } from "@mui/system";
import StyledListItem from "./listitem";

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
  const [isPlusIcon, setIsPlusIcon] = useState(false);

  const toggleDrawer = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
    setIsPlusIcon(!isPlusIcon);
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
          >
            {isPlusIcon ? <ArrowBackIosIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer anchor="left" open={isSidebarOpen} onClose={toggleDrawer}>
        <StyledDrawerContent
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <div>
            <StyledListItem href="/" primary="Home" />
            <StyledListItem href="/about" primary="About" />
            <StyledListItem href="/contact" primary="Contact" />
            <StyledListItem href="/signup" primary="Signup" />
            <StyledListItem href="/login" primary="Login" />
            <Divider />
          </div>
        </StyledDrawerContent>
      </StyledDrawer>
    </div>
  );
}

export default Navbar;
