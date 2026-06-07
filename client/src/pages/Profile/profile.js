/* Copyright (c) 2023, Jason Oltzen */

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { deleteUser } from "firebase/auth";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../core/auth/auth";
import { auth } from "../../firebase";
import { deleteUserData } from "../../services/db";
import { ColorModeContext } from "../../theme";

function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const colorMode = useContext(ColorModeContext);

  const [newFirstName, setNewFirstName] = useState(user?.firstname || "");
  const [newSurName, setNewSurName] = useState(user?.surname || "");
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState("");
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserData(user.id);
      await deleteUser(auth.currentUser);
      logout();
      navigate("/login");
    } catch (error) {
      setSnackbarErrorMessage("Konto konnte nicht gelöscht werden. Bitte erneut versuchen.");
      setOpenErrorSnackbar(true);
    }
    setOpenDeleteDialog(false);
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser({ firstname: newFirstName, surname: newSurName, username: newUsername, email: newEmail });
      setSnackbarSuccessMessage("Profil erfolgreich aktualisiert.");
      setOpenSuccessSnackbar(true);
    } catch (error) {
      setSnackbarErrorMessage("Daten konnten nicht aktualisiert werden.");
      setOpenErrorSnackbar(true);
    }
  };

  const initials = `${user?.firstname?.charAt(0) || ""}${user?.surname?.charAt(0) || ""}`.toUpperCase() || "?";
  const bg = isDark ? "#262b3d" : "#ffffff";
  const cardBg = isDark ? "#2e3450" : "#f7f8fc";

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
      "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
      "&:hover fieldset": { borderColor: "rgba(198,170,96,0.5)" },
      "&.Mui-focused fieldset": { borderColor: "#c6aa60" },
    },
    "& .MuiInputLabel-root": { color: isDark ? "rgba(224,227,233,0.45)" : "rgba(44,47,54,0.45)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#c6aa60" },
    "& .MuiInputBase-input": { color: theme.palette.text.main },
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 6, px: { xs: 2, sm: 4 } }}>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={5000} onClose={() => setOpenSuccessSnackbar(false)}>
        <Alert severity="success" onClose={() => setOpenSuccessSnackbar(false)} sx={{ borderRadius: 2 }}>{snackbarSuccessMessage}</Alert>
      </Snackbar>
      <Snackbar open={openErrorSnackbar} autoHideDuration={5000} onClose={() => setOpenErrorSnackbar(false)}>
        <Alert severity="error" onClose={() => setOpenErrorSnackbar(false)} sx={{ borderRadius: 2 }}>{snackbarErrorMessage}</Alert>
      </Snackbar>

      <Box sx={{ maxWidth: 680, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PersonIcon sx={{ color: "#c6aa60", fontSize: 22 }} />
            <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: 700 }}>Profil</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Farbmodus wechseln">
              <IconButton onClick={colorMode.toggleColorMode} size="small"
                sx={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", borderRadius: 2 }}>
                {isDark
                  ? <DarkModeOutlinedIcon sx={{ fontSize: 18, color: "#c6aa60" }} />
                  : <LightModeOutlinedIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />}
              </IconButton>
            </Tooltip>
            <Button onClick={handleLogout} size="small" variant="outlined" startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
              sx={{ borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)", color: theme.palette.text.main, borderRadius: 2, fontSize: "0.8rem" }}>
              Logout
            </Button>
          </Box>
        </Box>

        {/* Avatar card */}
        <Card sx={{ backgroundColor: cardBg, borderRadius: 3, mb: 3, border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: "none" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 3, p: 3 }}>
            <Avatar sx={{ width: 72, height: 72, backgroundColor: "#3A415C", border: "3px solid #c6aa60", fontSize: "1.6rem", fontWeight: 700, color: "#c6aa60" }}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: theme.palette.text.main, fontWeight: 700 }}>
                {user?.firstname} {user?.surname}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.main, opacity: 0.45, mt: 0.25 }}>
                @{user?.username}
              </Typography>
              <Typography variant="caption" sx={{ color: "#c6aa60", opacity: 0.8 }}>
                {user?.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card sx={{ backgroundColor: bg, borderRadius: 3, mb: 3, border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: "none" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: "#c6aa60", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", mb: 2.5, fontSize: "0.72rem" }}>
              Persönliche Daten
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Vorname" fullWidth value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} sx={fieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Nachname" fullWidth value={newSurName} onChange={(e) => setNewSurName(e.target.value)} sx={fieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Benutzername" fullWidth value={newUsername} onChange={(e) => setNewUsername(e.target.value)} sx={fieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="E-Mail" fullWidth type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} sx={fieldSx} />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleUpdateUser} variant="contained"
                sx={{ backgroundColor: "#c6aa60", color: "#1a1e2e", fontWeight: 700, borderRadius: 2, px: 4,
                  "&:hover": { backgroundColor: "#b99a50", boxShadow: "0 4px 12px rgba(198,170,96,0.35)" } }}>
                Speichern
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card sx={{ backgroundColor: bg, borderRadius: 3, border: "1px solid rgba(239,83,80,0.2)", boxShadow: "none" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: "#ef5350", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", mb: 2, fontSize: "0.72rem" }}>
              Gefahrenzone
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.main, fontWeight: 600 }}>Konto löschen</Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.main, opacity: 0.4 }}>
                  Alle Daten werden dauerhaft gelöscht. Nicht rückgängig machbar.
                </Typography>
              </Box>
              <Button onClick={() => setOpenDeleteDialog(true)} variant="outlined" size="small" startIcon={<WarningAmberIcon sx={{ fontSize: 15 }} />}
                sx={{ borderColor: "rgba(239,83,80,0.4)", color: "#ef5350", borderRadius: 2, whiteSpace: "nowrap", ml: 2,
                  "&:hover": { borderColor: "#ef5350", backgroundColor: "rgba(239,83,80,0.06)" } }}>
                Konto löschen
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ sx: { backgroundColor: bg, borderRadius: 3, border: "1px solid rgba(239,83,80,0.2)" } }}>
        <DialogTitle sx={{ color: theme.palette.text.main, fontWeight: 700 }}>Konto löschen bestätigen?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.text.main, opacity: 0.6 }}>
            Bist du sicher, dass du dein Konto löschen möchtest? Alle deine Daten, Transaktionen und Einstellungen werden dauerhaft gelöscht.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined"
            sx={{ borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", color: theme.palette.text.main, borderRadius: 2 }}>
            Abbrechen
          </Button>
          <Button onClick={handleDeleteAccount} variant="contained" color="error"
            sx={{ borderRadius: 2, fontWeight: 700 }}>
            Endgültig löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfilePage;
