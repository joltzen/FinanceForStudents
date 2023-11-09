// PasswortResetPage.js

import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import axiosInstance from "../../config/axios";
import Page from "../../components/page";
function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/password-reset-request", { email });
      alert(
        "If your email is in our system, you will receive a password reset link."
      );
    } catch (error) {
      console.error("Failed to request password reset", error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Passwort zurücksetzen
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          // ... Ähnliche Stilisierung wie die Login TextFields
          label="E-Mail-Adresse"
          name="email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            "& label.Mui-focused": {
              color: "#e0e3e9",
            },
            "& label": {
              color: "#e0e3e9",
            },
            "& input": {
              color: "#d1d1d1",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#d1d1d1",
              },
              "&:hover fieldset": {
                borderColor: "#e0e3e9",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#e0e3e9",
              },
            },
            backgroundColor: "#2c2f36",
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: "button",
            color: "#e0e3e9",
            fontSize: "1rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Absenden
        </Button>
      </Box>
    </Box>
  );
}

export default PasswordResetPage;
