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
import axiosInstance from "../../config/axios";

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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [surnameError, setSurnameError] = useState("");

  const validateInput = () => {
    let isValid = true;

    // Example validation for email
    if (!email.includes("@")) {
      setEmailError("Invalid email format");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Add similar validation for other fields...

    return isValid;
  };

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
        error.response.data.message || "Failed to Signup. Please try again."
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
              sx={{ mt: 1, width: "70%" }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "bold",
                }}
              >
                Signup
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <InputLabel htmlFor="firstname">Vorname</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="firstname"
                    margin="normal"
                    autoFocus
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
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
                </Grid>
                <Grid item xs={4}>
                  <InputLabel htmlFor="surname">Nachname</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="surname"
                    margin="normal"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
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
                </Grid>
                <Grid item xs={4}>
                  <InputLabel htmlFor="username">Benutzername</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="username"
                    margin="normal"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                </Grid>

                <Grid item xs={4}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="email"
                    margin="normal"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                </Grid>
                <Grid item xs={4}>
                  <InputLabel htmlFor="password">Passwort</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="password"
                    margin="normal"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                </Grid>
                <Grid item xs={4}>
                  <InputLabel htmlFor="passwordconfirmation">
                    Passwort bestätigen
                  </InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="passwordconfirmation"
                    margin="normal"
                    type="password"
                    autoComplete="current-password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                </Grid>
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
              </Grid>
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
