/* Copyright (c) 2023, Jason Oltzen */

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../core/auth/auth";

function SignUpForm() {
  const theme = useTheme();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Passwörter stimmen nicht überein");
      return;
    }
    if (!email.includes("@")) {
      setError("Ungültiges E-Mail-Format");
      return;
    }
    setError("");
    try {
      await signup(email, password, { username, firstname, surname, email });
      navigate("/login");
    } catch (err) {
      console.error("Sign up failed:", err);
      setError(err.message || "Registrierung fehlgeschlagen. Bitte erneut versuchen.");
    }
  };

  const fieldStyles = {
    "label + & .MuiInputBase-input": {
      "&:-webkit-autofill": {
        caretColor: "transparent",
        WebkitBoxShadow: `0 0 0 1000px ${theme.palette.left.main} inset`,
        backgroundColor: theme.palette.left.main,
        color: theme.palette.text.main,
        height: "2px",
      },
    },
    ".MuiOutlinedInput-root": {
      height: "40px",
      border: `1px solid ${theme.palette.text.main}`,
    },
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12} sm={6} style={{ height: "100%" }}>
        <Card style={{ height: "100%", width: "100%", backgroundColor: theme.palette.left.main }}>
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1, width: "70%" }}>
              <Typography variant="h4" sx={{ color: theme.palette.text.main, fontWeight: "bold" }}>
                Signup
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}><InputLabel>Vorname</InputLabel></Grid>
                <Grid item xs={8}>
                  <TextField variant="outlined" fullWidth margin="normal" value={firstname}
                    onChange={(e) => setFirstname(e.target.value)} sx={fieldStyles} />
                </Grid>
                <Grid item xs={4}><InputLabel>Nachname</InputLabel></Grid>
                <Grid item xs={8}>
                  <TextField variant="outlined" fullWidth margin="normal" value={surname}
                    onChange={(e) => setSurname(e.target.value)} sx={fieldStyles} />
                </Grid>
                <Grid item xs={4}><InputLabel>Benutzername</InputLabel></Grid>
                <Grid item xs={8}>
                  <TextField variant="outlined" fullWidth margin="normal" value={username}
                    onChange={(e) => setUsername(e.target.value)} sx={fieldStyles} />
                </Grid>
                <Grid item xs={4}><InputLabel>Email</InputLabel></Grid>
                <Grid item xs={8}>
                  <TextField variant="outlined" fullWidth margin="normal" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} sx={fieldStyles} />
                </Grid>
                <Grid item xs={4}><InputLabel>Passwort</InputLabel></Grid>
                <Grid item xs={8}>
                  <TextField variant="outlined" fullWidth margin="normal" type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} sx={fieldStyles} />
                </Grid>
                <Grid item xs={4}><InputLabel>Passwort bestätigen</InputLabel></Grid>
                <Grid item xs={8}>
                  <TextField variant="outlined" fullWidth margin="normal" type="password"
                    value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
                    sx={fieldStyles} />
                </Grid>
                <Button type="submit" fullWidth variant="contained"
                  sx={{ mt: 3, mb: 2, color: theme.palette.text.main, fontSize: "1.1rem" }}>
                  Signup
                </Button>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={0} sm={6} style={{ height: "100%" }}>
        <Card style={{
          height: "100%", width: "100%", display: "flex",
          backgroundColor: theme.palette.right.main,
          flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <img src="/logos/logo.png" alt="Schrift" style={{ maxWidth: "50%", maxHeight: "50%" }} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default SignUpForm;
