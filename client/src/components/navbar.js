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
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import SavingsIcon from "@mui/icons-material/Savings";
import Switch from "@mui/material/Switch";
import { ColorModeContext } from "../theme";
import { useTheme } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: 1400,
  position: "relative",
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: 1200,
  "& .MuiDrawer-paper": {
    backgroundColor: theme.pallete.list.main,
    color: theme.pallete.text.main,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  zIndex: 1200,
}));

const StyledDrawerContent = styled("div")(({ theme }) => ({
  width: "14vw",
  marginTop: "70px",

  "& .MuiDrawer-paper": {
    backgroundColor: theme.pallete.list.main,
    color: theme.pallete.text.main,
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
              color: theme.palette.icon.main,
              fontSize: "20px",
            }}
          >
            {isPlusIcon ? (
              <ArrowBackIosIcon fontSize="inherit" />
            ) : (
              <MenuIcon fontSize="inherit" />
            )}
          </IconButton>
          <Switch
            checked={colorMode.mode === "dark"}
            onChange={colorMode.toggleColorMode}
            color="default"
          />
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
                  sx={{ color: theme.palette.icon.main, fontSize: "20px" }}
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
                href="/settings"
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
