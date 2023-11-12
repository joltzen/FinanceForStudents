import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useAuth } from "../../core/auth/auth";
import { useNavigate } from "react-router";
import axiosInstance from "../../config/axios";
import { Link } from "@mui/material";
import TextComp from "../../components/TextComp";

function LoginPage() {
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
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextComp
          margin="normal"
          required
          fullWidth
          id="identifier"
          label="Username/Email"
          name="identifier"
          autoComplete="identifier"
          autoFocus
          value={credentials.identifier}
          onChange={handleChange}
        />
        <TextComp
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleChange}
        />
        <Link href="/password-reset" underline="hover" sx={{ color: "white" }}>
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
            color: "#e0e3e9",
            fontSize: "1rem",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
