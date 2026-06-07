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
import { useAuth } from "../../core/auth/auth";
import { deleteUserData } from "../../services/db";
import { ColorModeContext } from "../../theme";
import { auth } from "../../firebase";
import { deleteUser } from "firebase/auth";

function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [newFirstName, setNewFirstName] = useState(user?.firstname);
  const [newSurName, setNewSurName] = useState(user?.surname);
  const [newUsername, setNewUsername] = useState(user?.username);
  const [newEmail, setNewEmail] = useState(user?.email);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState("");
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserData(user.id);
      await deleteUser(auth.currentUser);
      setSnackbarSuccessMessage("Dein Profil wurde erfolgreich gelöscht.");
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
    setOpenDeleteDialog(false);
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser({
        firstname: newFirstName,
        surname: newSurName,
        username: newUsername,
        email: newEmail,
      });
      setSnackbarSuccessMessage("Dein Profil wurde erfolgreich aktualisiert.");
      setOpenSuccessSnackbar(true);
    } catch (error) {
      setSnackbarErrorMessage(
        "Deine Daten konnten nicht aktualisiert werden. Bitte versuche es erneut."
      );
      setOpenErrorSnackbar(true);
    }
  };

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [avatarColor] = useState(() => localStorage.getItem("avatarColor") || teal[500]);

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent="center" alignItems="flex-start">
          <Snackbar open={openSuccessSnackbar} autoHideDuration={6000}
            onClose={() => setOpenSuccessSnackbar(false)}>
            <Alert onClose={() => setOpenSuccessSnackbar(false)} severity="success" sx={{ width: "100%" }}>
              {snackbarSuccessMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={openErrorSnackbar} autoHideDuration={6000}
            onClose={() => setOpenErrorSnackbar(false)}>
            <Alert onClose={() => setOpenErrorSnackbar(false)} severity="error" sx={{ width: "100%" }}>
              {snackbarErrorMessage}
            </Alert>
          </Snackbar>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h4" sx={{ mb: 2 }}>Profil</Typography>
            <Card sx={{ borderRadius: 5, backgroundColor: theme.palette.card.main, boxShadow: theme.shadows[6] }}>
              <CardContent>
                <Grid container direction="column" alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar sx={{ bgcolor: avatarColor, width: 76, height: 76 }}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5">{user?.firstname} {user?.surname}</Typography>
                    <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ mt: 1 }}>
                      {theme.palette.mode === "dark"
                        ? <DarkModeOutlinedIcon sx={{ color: "white" }} />
                        : <LightModeOutlinedIcon sx={{ color: "black" }} />}
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 5, mt: 7, backgroundColor: theme.palette.card.main, boxShadow: theme.shadows[6] }}>
              <CardContent>
                <form>
                  <TextField fullWidth label="Vorname" defaultValue={newFirstName} margin="normal"
                    onChange={(e) => setNewFirstName(e.target.value)} />
                  <TextField fullWidth label="Nachname" defaultValue={newSurName} margin="normal"
                    onChange={(e) => setNewSurName(e.target.value)} />
                  <TextField fullWidth label="Benutzername" defaultValue={newUsername} margin="normal"
                    onChange={(e) => setNewUsername(e.target.value)} />
                  <TextField fullWidth label="Email Adresse" defaultValue={newEmail} margin="normal"
                    onChange={(e) => setNewEmail(e.target.value)} />
                  <Grid container sx={{ mt: 3 }}>
                    <Grid item xs={4}>
                      <Button variant="contained" color="primary" onClick={handleUpdateUser}>Speichern</Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button onClick={handleLogout} variant="contained" color="primary">Logout</Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button onClick={() => setOpenDeleteDialog(true)} variant="contained" color="error">
                        Delete Account
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
            <DialogTitle>{"Account löschen bestätigen?"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Bist du sicher, dass du deinen Account löschen möchtest? Dieser Vorgang kann nicht rückgängig gemacht werden.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)} color="primary" variant="contained">
                Abbrechen
              </Button>
              <Button onClick={handleDeleteAccount} color="primary" autoFocus variant="contained">
                Bestätigen
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProfilePage;
