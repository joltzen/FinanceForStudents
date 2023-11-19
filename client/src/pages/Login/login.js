import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  InputLabel,
  Link,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import TextComp from "../../components/TextComp";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import { ColorModeContext } from "../../theme";

function LoginPage() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext); // Access the color mode context

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
      {/* Left Section with Full-Width and Full-Height Card */}
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
              height: "100%", // Make sure CardContent takes full height of the Card
            }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "30%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%", // Ensure the container takes the full width
                  mb: 4, // Margin bottom for spacing below this row
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

              <InputLabel htmlFor="identifier">Username/Email</InputLabel>
              <TextComp
                margin="normal"
                required
                fullWidth
                id="identifier"
                name="identifier"
                autoComplete="identifier"
                autoFocus
                value={credentials.identifier}
                onChange={handleChange}
              />
              <InputLabel htmlFor="password" sx={{ marginTop: 2 }}>
                Password
              </InputLabel>
              <TextComp
                margin="normal"
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
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
