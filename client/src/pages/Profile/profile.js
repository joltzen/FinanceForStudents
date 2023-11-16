import { useState, useContext } from "react";
import { useAuth } from "../../core/auth/auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Page from "../../components/page";
import axiosInstance from "../../config/axios";
import CardComp from "../../components/CardComp";
import {
  Typography,
  Avatar,
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  deepPurple,
  red,
  pink,
  purple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
} from "@mui/material/colors";
import { ColorModeContext } from "../../theme";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { colors } from "../../config/constants";
function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axiosInstance.delete("/delete-account", {
        params: { userId: user.id },
      });
      logout();
      alert("Your account has been deleted.");
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account", error);
      alert("There was a problem deleting your account.");
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };
  const theme = useTheme();

  const colorMode = useContext(ColorModeContext); // Access the color mode context

  const colorOptions = colors; // Define color options
  
  const [avatarColor, setAvatarColor] = useState(() => {
    // Get the stored color from localStorage or fallback to default
    return localStorage.getItem("avatarColor") || teal[500];
  });
  const [openDialog, setOpenDialog] = useState(false);

  // Function to open the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const renderColorOptions = () => {
    return colorOptions.map((color, index) => (
      <Button
        key={index}
        style={{
          backgroundColor: color,
          margin: "4px",
          color: theme.palette.text.main,
          borderRadius: "50%", // Makes the button circular
          width: "20px", // Equal width and height
          height: "20px",
          minWidth: "20px", // Prevents the button from being too small
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          setAvatarColor(color);
          handleCloseDialog();
          localStorage.setItem("avatarColor", color); // Store new color
        }}
      />
    ));
  };

  return (
    <Page>
      <CardComp title="Profile" sx={{ mt: 10, padding: 5 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: avatarColor, width: 56, height: 56 }}>
            {user?.username.charAt(0).toUpperCase()}
          </Avatar>
          <Button
            sx={{ color: theme.palette.text.main }}
            onClick={handleOpenDialog}
          >
            Change Avatar Color
          </Button>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.card.main,
                color: theme.palette.text.main,
              }}
            >
              Wähle eine Farbe aus
            </DialogTitle>
            <DialogContent
              sx={{
                backgroundColor: theme.palette.card.main,
                color: theme.palette.text.main,
              }}
            >
              {renderColorOptions()}
            </DialogContent>
            <DialogActions
              sx={{
                backgroundColor: theme.palette.card.main,
                color: theme.palette.text.main,
              }}
            >
              <Button
                sx={{ color: theme.palette.text.main }}
                onClick={handleCloseDialog}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Typography
            variant="h5"
            sx={{ mt: 2, color: theme.palette.profile.main }}
          >
            Welcome, {user?.firstname}!
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.profile.main }}>
              Username: <strong>{user?.username}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.profile.main }}>
              First Name: <strong>{user?.firstname}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.profile.main }}>
              Last Name: <strong>{user?.surname}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.profile.main }}>
              Email: <strong>{user?.email}</strong>
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
            <Typography sx={{ mr: 2, color: theme.palette.profile.main }}>
              <strong>Farbmodus ändern</strong>
            </Typography>
            {colorMode.mode}
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon sx={{ color: "white" }} />
              ) : (
                <LightModeOutlinedIcon sx={{ color: "black" }} />
              )}
            </IconButton>
          </Box>
        </Grid>
        <Box mt={4}>
          <Button
            onClick={handleLogout}
            fullWidth
            variant="contained"
            color="primary"
          >
            Logout
          </Button>
          <Button
            onClick={handleOpen}
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Change Password
          </Button>
          <Button
            onClick={handleDeleteAccount}
            fullWidth
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            Delete Account
          </Button>
        </Box>
      </CardComp>
    </Page>
  );
}

export default ProfilePage;
