import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import React from "react";

function SavingDialog({
  open,
  handleOpen,
  handleSubmit,
  alter,
  alterDuration,
  setAlert,
  setAlertDuration,
  savingGoal,
  handleChange,
}) {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={handleOpen}>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.card.main,
          color: theme.palette.text.main,
          fontSize: "1.2rem", // Größere Schrift für den Titel
          fontWeight: "bold",
          minWidth: "400px",
        }}
      >
        Sparziel setzen
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: theme.palette.card.main }}>
        {alter && (
          <>
            <Box sx={{ width: "100%" }}>
              <Collapse in={open}>
                <Alert
                  severity="warning"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  <strong>Das Enddatum muss nach dem Startdatum liegen!</strong>
                </Alert>
              </Collapse>
            </Box>
          </>
        )}
        {alterDuration && (
          <>
            <Box sx={{ width: "100%" }}>
              <Collapse in={open}>
                <Alert
                  severity="error"
                  variant="filled"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertDuration(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  <strong>
                    Das manuell festgelegte Enddatum führt zu einer anderen
                    Dauer als berechnet. Bitte passen Sie Ihr monatliches Sparen
                    entsprechend an.
                  </strong>
                </Alert>
              </Collapse>
            </Box>
          </>
        )}

        <InputLabel style={{ color: theme.palette.text.main }}>
          Monatliches Sparen *
        </InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          name="monthly_saving"
          margin="normal"
          value={savingGoal.monthly_saving}
          onChange={handleChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />

        <InputLabel style={{ color: theme.palette.text.main }}>
          Sparziel *
        </InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          name="total_amount"
          margin="normal"
          value={savingGoal.total_amount}
          onChange={handleChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />

        <InputLabel style={{ color: theme.palette.text.main }}>
          Beschreibung
        </InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          name="description"
          margin="normal"
          value={savingGoal.description}
          onChange={handleChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />

        <InputLabel style={{ color: theme.palette.text.main }}>
          Startdatum
        </InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          name="startdate"
          margin="normal"
          type="date"
          value={savingGoal.startdate}
          onChange={handleChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />

        <InputLabel style={{ color: theme.palette.text.main }}>
          Deadline
        </InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          name="deadline"
          margin="normal"
          type="date"
          value={savingGoal.deadline}
          onChange={handleChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />

        <InputLabel style={{ color: theme.palette.text.main }}>
          Dauer in Monaten
        </InputLabel>
        <TextField
          variant="outlined"
          fullWidth
          name="duration"
          margin="normal"
          value={savingGoal.duration}
          onChange={handleChange}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "40px",
              border: `1px solid ${theme.palette.text.main}`,
            },
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{ backgroundColor: theme.palette.card.main, padding: "10px" }}
      >
        <Button onClick={handleOpen} color="secondary" variant="outlined">
          Abbrechen
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SavingDialog;
