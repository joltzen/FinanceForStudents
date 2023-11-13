import React, { useState } from "react";
import axiosInstance from "../../config/axios";
import { Button, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router";
import TextComp from "../../components/TextComp";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await axiosInstance.post("http://localhost:3001/api/signup", {
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
      <Typography variant="h4" sx={{ mb: 2, color: "#e0e3e9" }}>
        Signup
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSignUp}>
        <TextComp
          label="Firstname"
          type="firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextComp
          label="Surname"
          type="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextComp
          label="Username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextComp
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextComp
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="button"
          sx={{
            mt: 3,
            mb: 2,
            color: "#e0e3e9",
            fontSize: "1.1rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Signup
        </Button>
      </form>
    </Box>
  );
}
export default SignUpForm;
