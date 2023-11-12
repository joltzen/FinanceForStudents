import { useState } from "react";
import { useAuth } from "../../core/auth/auth";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Page from "../../components/page";
import axiosInstance from "../../config/axios";
import CardComp from "../../components/CardComp";
import { Typography, Avatar, Box, Grid } from "@mui/material";
import { deepPurple } from "@mui/material/colors";

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

  return (
    <Page>
      <CardComp title="Profile" sx={{ mt: 10, padding: 5 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: deepPurple[500], width: 56, height: 56 }}>
            {user?.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Welcome, {user?.firstname}!
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Typography>
              Username: <strong>{user?.username}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              First Name: <strong>{user?.firstname}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Last Name: <strong>{user?.surname}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Email: <strong>{user?.email}</strong>
            </Typography>
          </Grid>
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
