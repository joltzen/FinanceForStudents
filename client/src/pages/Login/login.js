/* Copyright (c) 2023, Jason Oltzen */

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../core/auth/auth";
import { ColorModeContext } from "../../theme";

function LoginPage() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(credentials.identifier, credentials.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen.");
    }
  };

  const isDark = theme.palette.mode === "dark";
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
          }}
          elevation={0}
        >
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: { xs: "85%", sm: "70%", md: "55%" } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h3" sx={{ color: theme.palette.text.main }}>
                  Login
                </Typography>
                <IconButton onClick={colorMode.toggleColorMode} size="small"
                  sx={{ color: isDark ? "#c6aa60" : theme.palette.text.main }}>
                  {isDark ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                </IconButton>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

              <TextField
                label="E-Mail"
                variant="outlined"
                fullWidth
                name="identifier"
                type="email"
                value={credentials.identifier}
                onChange={handleChange}
                sx={{ ...fieldSx, mb: 2 }}
              />
              <TextField
                label="Passwort"
                variant="outlined"
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgba(198,170,96,0.7)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 3 }}>
                <Link href="/password-reset" underline="hover"
                  sx={{ color: "rgba(198,170,96,0.8)", fontSize: "0.85rem" }}>
                  Passwort vergessen?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#c6aa60",
                  color: "#1a1e2e",
                  fontWeight: 700,
                  fontSize: "1rem",
                  py: 1.4,
                  "&:hover": { backgroundColor: "#b99a50", boxShadow: "0 4px 12px rgba(198,170,96,0.4)" },
                }}
              >
                Einloggen
              </Button>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.main, opacity: 0.6 }}>
                  Noch kein Konto?{" "}
                  <Link href="/signup" underline="hover" sx={{ color: "#c6aa60", fontWeight: 600 }}>
                    Registrieren
                  </Link>
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
          <img src="/logos/logo.png" alt="Logo" style={{ maxWidth: "45%", maxHeight: "45%", opacity: 0.92 }} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
