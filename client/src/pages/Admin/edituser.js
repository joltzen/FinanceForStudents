import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function EditUserForm({ user, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: user.id,
    username: user.username,
    email: user.email,
    firstname: user.firstname,
    surname: user.surname,
    admin: user.admin,
  });

  const handleAdminChange = (event) => {
    setFormData({ ...formData, admin: event.target.checked });
  };
  useEffect(() => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      surname: user.surname,
      admin: user.admin,
    });
  }, [user]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = () => {
    onSubmit(formData);
    onCancel();
  };

  return (
    <Dialog open={Boolean(user)} onClose={onCancel}>
      <DialogTitle>Benutzer bearbeiten</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Benutzername"
          type="text"
          fullWidth
          variant="outlined"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="E-Mail"
          type="email"
          fullWidth
          variant="outlined"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Vorname"
          type="text"
          fullWidth
          variant="outlined"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Nachname"
          type="text"
          fullWidth
          variant="outlined"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.admin}
              onChange={handleAdminChange}
              name="admin"
              color="primary"
            />
          }
          label="Admin"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button variant="contained" onClick={handleFormSubmit} color="primary">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUserForm;
