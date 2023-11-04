import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useAuth } from "../../core/auth/auth";
import { useNavigate } from "react-router";
import axiosInstance from "../../config/axios"; // Adjust the path as necessary

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
      console.log("test2", response.data);
      login({ username: response.data.username });
      console.log("Login successful:", response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Failed to login. Please try again."
      ); // Displaying server-provided error message or a generic error message
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
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
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
          sx={{
            "& label.Mui-focused": {
              color: "white",
            },
            "& label": {
              color: "white",
            },
            "& input": {
              color: "#d1d1d1",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#d1d1d1",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
            backgroundColor: "#2c2f36",
          }}
        />

        <TextField
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
          sx={{
            "& label.Mui-focused": {
              color: "white",
            },
            "& label": {
              color: "white",
            },
            "& input": {
              color: "#d1d1d1",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#d1d1d1",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
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
            backgroundColor: "#3A415C",
            color: "white",
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
