/* Copyright (c) 2023, Jason Oltzen */

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import { teal } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import { ColorModeContext } from "../../theme";

function ProfilePage() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [newFirstName, setNewFirstName] = useState(user?.firstname);
  const [newSurName, setNewSurName] = useState(user?.surname);
  const [newUsername, setNewUsername] = useState(user?.username);
  const [newEmail, setNewEmail] = useState(user?.email);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [snackbarSuccessMessage, setSnackbarSuccuessMessage] = useState("");
  const [snackbarErroreMessage, setSnackbarErrorMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete("/delete-account", {
        params: { userId: user.id },
      });

      setSnackbarSuccuessMessage("Dein Profil wurde erfolgreich gelöscht.");
      setOpenSuccessSnackbar(true);
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account", error);
      setSnackbarErrorMessage(
        "Dein Konto konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
      setOpenErrorSnackbar(true);
    }
    handleCloseDeleteDialog(); // Close the dialog after action
  };

  const updateUser = async () => {
    try {
      const response = await axiosInstance.patch("/updateUser", {
        firstname: newFirstName,
        surname: newSurName,
        username: newUsername,
        email: newEmail,
        userId: user.id,
      });
      // Assuming the response contains the updated user information
      const updatedUser = response.data;

      // Update user context
      setSnackbarSuccuessMessage("Dein Profil wurde erfolgreich aktualisiert.");
      setOpenSuccessSnackbar(true);
      login(updatedUser);
    } catch (error) {
      setSnackbarErrorMessage(
        "Deine Daten konnten nicht aktualisiert werden. Bitte versuche es erneut."
      );
      setOpenErrorSnackbar(true);
    }
  };

  const theme = useTheme();

  const colorMode = useContext(ColorModeContext); // Access the color mode context

  const [avatarColor, setAvatarColor] = useState(() => {
    // Get the stored color from localStorage or fallback to default
    return localStorage.getItem("avatarColor") || teal[500];
  });

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center" // Center everything vertically
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="flex-start" // Align the tops of the cards
        >
          <Snackbar
            open={openSuccessSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSuccessSnackbar(false)}
          >
            <Alert
              onClose={() => setOpenSuccessSnackbar(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              {snackbarSuccessMessage}
            </Alert>
          </Snackbar>
          <Snackbar
            open={openErrorSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenErrorSnackbar(false)}
          >
            <Alert
              onClose={() => setOpenErrorSnackbar(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {snackbarErroreMessage}
            </Alert>
          </Snackbar>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Profil
            </Typography>
            <Card sx={{ borderRadius: 5 }}>
              <CardContent>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <Avatar
                      sx={{ bgcolor: avatarColor, width: 56, height: 56 }}
                    >
                      {user?.username.charAt(0).toUpperCase()}
                    </Avatar>{" "}
                  </Grid>
                  <Grid item>
                    <Typography variant="h5">
                      {user?.firstname} {user?.surname}
                    </Typography>
                    {colorMode.mode}
                    <IconButton
                      onClick={colorMode.toggleColorMode}
                      color="inherit"
                      sx={{ mt: 1 }}
                    >
                      {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon sx={{ color: "white" }} />
                      ) : (
                        <LightModeOutlinedIcon sx={{ color: "black" }} />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 5, mt: 9 }}>
              <CardContent>
                <form>
                  <TextField
                    fullWidth
                    label="Vorname"
                    defaultValue={newFirstName}
                    margin="normal"
                    onChange={(e) => setNewFirstName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Nachname"
                    defaultValue={newSurName}
                    margin="normal"
                    onChange={(e) => setNewSurName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Benutzername"
                    defaultValue={newUsername}
                    margin="normal"
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Email Adresse"
                    defaultValue={newEmail}
                    margin="normal"
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <Grid container sx={{ mt: 3 }}>
                    <Grid item xs={4}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={updateUser}
                      >
                        Speichern
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        onClick={handleLogout}
                        variant="contained"
                        color="primary"
                      >
                        Logout
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        onClick={handleOpenDeleteDialog}
                        variant="contained"
                        color="error"
                      >
                        Delete Account
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Account löschen bestätitgen?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bist du sicher das du dir den Account löschen möchtest? Dieser
                Vorgang kann nicht rückgängig gemacht werden.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDeleteDialog}
                color="primary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                color="primary"
                autoFocus
                variant="contained"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProfilePage;
