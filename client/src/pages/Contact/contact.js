/* Copyright (c) 2023, Jason Oltzen */

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

function ContactPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Formular gesendet");
  };

  return (
    <div>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Willkommen auf der Kontaktseite!
        </Typography>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { margin: 2, width: "100%" },
              "& .MuiButton-root": { margin: 2 },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Kontaktformular
            </Typography>
            <TextField required label="Name" variant="outlined" />
            <TextField
              required
              label="E-Mail"
              variant="outlined"
              type="email"
            />
            <TextField
              label="Nachricht"
              variant="outlined"
              multiline
              rows={4}
              required
            />
            <Button variant="contained" type="submit">
              Senden
            </Button>
          </Box>
        </Paper>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Direkter Kontakt
        </Typography>
        <Typography variant="body1">
          Sie erreichen uns auch direkt per E-Mail unter:
          webmaster@financeforstudents.com
        </Typography>
      </Container>
    </div>
  );
}

export default ContactPage;
