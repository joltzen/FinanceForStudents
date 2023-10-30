import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box } from "@mui/material";
function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      // Here, add your API endpoint to post the data
      const response = await axios.post("http://localhost:3001/api/signup", {
        username,
        email,
        password,
      });
      console.log(response.data);
      // Handle success here (e.g., redirect to login page, show message)
    } catch (error) {
      console.error("Sign up failed:", error);
      // Handle error here (e.g., show error message)
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto", // margin left & right
        mt: 5, // margin top
      }}
    >
      <form onSubmit={handleSignUp}>
        <TextField
          label="Username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
      </form>
    </Box>
  );
}
export default SignUpForm;
