/* Copyright (c) 2026, Jason Oltzen */

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
      setError(
        err.message || "Registrierung fehlgeschlagen. Bitte erneut versuchen.",
      );
    }
  };

  const autofillBg = theme.palette.left.main;
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(198,170,96,0.4)" },
      "&:hover fieldset": { borderColor: "rgba(198,170,96,0.7)" },
      "&.Mui-focused fieldset": { borderColor: "#c6aa60" },
    },
    "& .MuiInputLabel-root": { color: "rgba(198,170,96,0.7)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#c6aa60" },
    "& .MuiInputBase-input": {
      color: theme.palette.text.main,
      "&:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 1000px ${autofillBg} inset`,
        WebkitTextFillColor: theme.palette.text.main,
      },
    },
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12} sm={6} style={{ height: "100%" }}>
        <Card
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: theme.palette.left.main,
            borderRadius: 0,
            overflowY: "auto",
          }}
          elevation={0}
        >
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100%",
              padding: "32px 24px",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSignUp}
              noValidate
              sx={{ width: { xs: "85%", sm: "75%", md: "60%" } }}
            >
              <Typography
                variant="h3"
                sx={{ color: theme.palette.text.main, mb: 1 }}
              >
                Registrieren
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.main, opacity: 0.5, mb: 4 }}
              >
                Erstelle dein FinanceForStudents-Konto
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Vorname"
                    variant="outlined"
                    fullWidth
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Nachname"
                    variant="outlined"
                    fullWidth
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Benutzername"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="E-Mail"
                    variant="outlined"
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Passwort"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Passwort bestätigen"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 1,
                      backgroundColor: "#c6aa60",
                      color: "#1a1e2e",
                      fontWeight: 700,
                      fontSize: "1rem",
                      py: 1.4,
                      "&:hover": {
                        backgroundColor: "#b99a50",
                        boxShadow: "0 4px 12px rgba(198,170,96,0.4)",
                      },
                    }}
                  >
                    Konto erstellen
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.main, opacity: 0.6 }}
                >
                  Bereits registriert?{" "}
                  <a
                    href="/login"
                    style={{
                      color: "#c6aa60",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Einloggen
                  </a>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={0} sm={6} style={{ height: "100%" }}>
        <Card
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: theme.palette.right.main,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 0,
          }}
          elevation={0}
        >
          <img
            src="/logos/logo.png"
            alt="Logo"
            style={{ maxWidth: "45%", maxHeight: "45%", opacity: 0.92 }}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default SignUpForm;
