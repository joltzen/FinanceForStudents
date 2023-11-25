/* Copyright (c) 2023, Jason Oltzen */

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  InputLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import { ColorModeContext } from "../../theme";
function LoginPage() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext); // Access the color mode context
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosInstance.post("/login", credentials);
      login({
        id: response.data.id,
        username: response.data.username,
        firstname: response.data.firstname,
        surname: response.data.surname,
        email: response.data.email,
      });
      console.log("Login successful:", response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
      );
    }
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12} sm={6} style={{ height: "100%" }}>
        <Card
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: theme.palette.left.main,
          }}
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
            {error && <Alert severity="error">{error}</Alert>}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "50%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%", 
                  mb: 4,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: theme.palette.text.main, fontWeight: "bold" }}
                >
                  Login
                </Typography>
                <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                  {theme.palette.mode === "dark" ? (
                    <DarkModeOutlinedIcon sx={{ color: "white" }} />
                  ) : (
                    <LightModeOutlinedIcon sx={{ color: "black" }} />
                  )}
                </IconButton>
              </Box>
              <InputLabel htmlFor="identifier">Benutzername/Email</InputLabel>
              <TextField
                variant="outlined"
                fullWidth
                name="identifier"
                margin="normal"
                value={credentials.identifier}
                onChange={handleChange}
                sx={{
                  "label + & .MuiInputBase-input": {
                    // Adjust the styles for when the input is autofilled
                    "&:-webkit-autofill": {
                      caretColor: "transparent", // Removes the caret if you also want to hide that
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
                }}
              />

              <InputLabel htmlFor="password" sx={{ marginTop: 2 }}>
                Password
              </InputLabel>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                margin="normal"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handlePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                }}
              />

              <Link
                href="/password-reset"
                underline="hover"
                sx={{ color: theme.palette.text.main, marginTop: 2 }}
              >
                {"Passwort vergessen?"}
              </Link>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "button",
                  fontSize: "1rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                Login
              </Button>
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
          }}
        >
          <img
            src="/logos/logo.png"
            alt="Schrift"
            style={{ maxWidth: "50%", maxHeight: "50%" }}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
