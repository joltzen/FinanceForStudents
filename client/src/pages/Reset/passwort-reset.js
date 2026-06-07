/* Copyright (c) 2023, Jason Oltzen */

import { Box, Button, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useAuth } from "../../core/auth/auth";

function PasswordResetPage() {
  const theme = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSent(true);
    } catch (error) {
      console.error("Failed to request password reset", error);
    }
  };

  return (
    <Box sx={{
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", height: "100vh", maxWidth: 400, mx: "auto",
    }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Passwort zurücksetzen</Typography>
      {sent ? (
        <Typography>
          Falls deine E-Mail in unserem System vorhanden ist, erhältst du in Kürze eine E-Mail zum Zurücksetzen deines Passworts.
        </Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="E-Mail-Adresse" name="email" type="email" required fullWidth
            value={email} onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& label.Mui-focused": { color: theme.palette.text.main },
              "& label": { color: theme.palette.text.main },
              "& input": { color: theme.palette.savetext?.main },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: theme.palette.savetext?.main },
                "&:hover fieldset": { borderColor: theme.palette.text.main },
                "&.Mui-focused fieldset": { borderColor: theme.palette.text.main },
              },
              backgroundColor: theme.palette.pr?.main,
            }}
          />
          <Button type="submit" fullWidth variant="contained"
            sx={{ mt: 3, mb: 2, color: theme.palette.text.main, fontSize: "1rem" }}>
            Absenden
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default PasswordResetPage;
