import React, { useState } from "react";
import axiosInstance from "../../config/axios";
import {
  Button,
  Box,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router";
import TextComp from "../../components/TextComp";
import { useTheme } from "@mui/material/styles";

function SignUpForm() {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      await axiosInstance.post("/signup", {
        username,
        email,
        password,
        firstname,
        surname,
      });
      navigate("/login");
    } catch (error) {
      console.error("Sign up failed:", error);
      setError(
        error.response?.data?.message || "Failed to login. Please try again."
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
              height: "100%",
            }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            <Box
              component="form"
              onSubmit={handleSignUp}
              noValidate
              sx={{ mt: 1, width: "30%" }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 4,
                  color: theme.palette.text.main,
                  fontWeight: "bold",
                }}
              >
                Signup
              </Typography>

              <InputLabel htmlFor="firstname" sx={{ mt: 2 }}>
                Firstname
              </InputLabel>
              <TextComp
                margin="normal"
                required
                fullWidth
                id="firstname"
                name="firstname"
                autoComplete="firstname"
                autoFocus
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <InputLabel htmlFor="surname" sx={{ mt: 2 }}>
                Surname
              </InputLabel>
              <TextComp
                margin="normal"
                required
                fullWidth
                id="surname"
                name="surname"
                autoComplete="surname"
                autoFocus
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
              <InputLabel htmlFor="username" sx={{ mt: 2 }}>
                Username
              </InputLabel>
              <TextComp
                margin="normal"
                required
                fullWidth
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <InputLabel htmlFor="email" sx={{ mt: 2 }}>
                Email
              </InputLabel>
              <TextComp
                required
                fullWidth
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputLabel htmlFor="password" sx={{ mt: 2 }}>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputLabel htmlFor="passwordconfirmation" sx={{ mt: 2 }}>
                Password bestätigen
              </InputLabel>
              <TextComp
                margin="normal"
                required
                fullWidth
                name="passwordconfirmation"
                type="password"
                id="passwordconfirmation"
                autoComplete="current-password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: theme.palette.text.main,
                  fontSize: "1.1rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                Signup
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
            display: "flex",
            backgroundColor: theme.palette.right.main,
            flexDirection: "column",
            alignItems: "center", // Center content horizontally
            justifyContent: "center", // Center content vertically
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
export default SignUpForm;
