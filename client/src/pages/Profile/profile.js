import { useState } from "react";
import { useAuth } from "../../core/auth/auth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import Page from "../../components/page";
import axiosInstance from "../../config/axios";
function ProfilePage() {
  const { user, logout, updatePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePassword = () => {
    // Implementiere updatePassword in deinem Auth Service
    updatePassword(password);
    setOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return; // Frühzeitige Rückkehr, wenn der Benutzer nicht bestätigt
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page>
      <h1>Profile Page</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
          >
            Passwort ändern
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            Account löschen
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Passwort ändern</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleChangePassword} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </p>
      )}
    </Page>
  );
}
export default ProfilePage;
