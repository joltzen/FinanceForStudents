import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Grid,
  Alert,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: "#262b3d",
  color: "#be9e44",
  boxShadow: theme.shadows[6],
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.primary.main),
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    right: theme.spacing(10),
  },
}));

const StyledTextField = styled(TextField)({
  marginTop: "20px",
  "& label.Mui-focused": {
    color: "#e0e3e9",
  },
  "& label": {
    color: "#e0e3e9",
  },
  "& input": {
    color: "#d1d1d1",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d1d1d1",
    },
    "&:hover fieldset": {
      borderColor: "#e0e3e9",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e0e3e9",
    },
  },
  backgroundColor: "#2e2e38",
});

function SavingPage() {
  const today = new Date().toISOString().split("T")[0];

  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [savingGoal, setSavingGoal] = useState({
    monthly_saving: "",
    total_amount: "",
    description: "",
    startdate: today,
    deadline: "",
    duration: "",
  });

  const [alter, setAlert] = useState(false);
  const [alterDuration, setAlertDuration] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedGoal = { ...savingGoal, [name]: value };

    if (name === "monthly_saving" || name === "total_amount") {
      const monthlySaving = parseFloat(updatedGoal.monthly_saving) || 0;
      const totalAmount = parseFloat(updatedGoal.total_amount) || 0;
      if (monthlySaving > 0) {
        const duration = Math.ceil(totalAmount / monthlySaving);
        updatedGoal = { ...updatedGoal, duration: duration.toString() };

        if (updatedGoal.startdate) {
          const startDate = new Date(updatedGoal.startdate);
          startDate.setMonth(startDate.getMonth() + duration);
          updatedGoal = {
            ...updatedGoal,
            deadline: startDate.toISOString().split("T")[0],
          };
        }
      }
    }

    if (name === "startdate" || name === "duration") {
      const startDate = updatedGoal.startdate
        ? new Date(updatedGoal.startdate)
        : new Date();
      const durationMonths = parseInt(updatedGoal.duration, 10) || 0;
      if (durationMonths > 0) {
        startDate.setMonth(startDate.getMonth() + durationMonths);
        updatedGoal = {
          ...updatedGoal,
          deadline: startDate.toISOString().split("T")[0],
        };
      }
    }
    if (name === "deadline") {
      const enteredDeadline = new Date(value);
      const startDate = new Date(updatedGoal.startdate);
      const calculatedDeadline = new Date(startDate);
      calculatedDeadline.setMonth(
        startDate.getMonth() + (parseInt(updatedGoal.duration, 10) || 0)
      );

      // Calculate the duration based on the new deadline
      const diffTime = Math.abs(enteredDeadline - startDate);
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // Approximate month difference

      if (diffMonths <= (parseInt(updatedGoal.duration, 10) || 0)) {
        setAlertDuration(true);
        return; // Prevent state update if the duration differs
      }
    }
    setSavingGoal(updatedGoal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user.id;
    if (
      savingGoal.deadline &&
      new Date(savingGoal.deadline) < new Date(savingGoal.startdate)
    ) {
      setAlert(true);
      return;
    }
    const savingGoalData = {
      ...savingGoal,
      userId: userId,
    };

    try {
      const response = await axiosInstance.post(
        "/saving-goals",
        savingGoalData
      );
      console.log(response.data);
      setSavingGoal({
        monthly_saving: "",
        total_amount: "",
        description: "",
        startdate: today,
        deadline: "",
        duration: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Fehler beim Speichern des Sparziels", error);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axiosInstance.get("/get-saving-goals", {
          params: { userId: user.id },
        });
        setGoals(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Sparziele", error);
        alert("Fehler beim Abrufen der Sparziele");
      }
    };

    fetchGoals();
  }, [savingGoal, user.id]);

  const handleDelete = async (goalId) => {
    console.log("Löschen des Sparziels mit ID:", goalId);
    try {
      const response = await axiosInstance.delete("/delete-saving-goal", {
        params: { id: goalId },
      });
      console.log(response.data);
      if (response.data) {
        setGoals(goals.filter((goal) => goal.id !== goalId));
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Sparziels", error);
    }
  };
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: 20 }}
      >
        <Grid item xs={12} md={8} lg={6}>
          <Typography variant="h3">Sparziele</Typography>
          <AddButton
            variant="contained"
            onClick={handleClickOpen}
            startIcon={<AddCircleOutlineIcon />}
          >
            Sparziel hinzufügen
          </AddButton>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ backgroundColor: "#262b3d", color: "#e0e3e9" }}>
              Sparziel setzen
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: "#262b3d" }}>
              <Box component="form" noValidate onSubmit={handleSubmit}>
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
                          <strong>
                            Das Enddatum muss nach dem Startdatum liegen!
                          </strong>
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
                            Das manuell festgelegte Enddatum führt zu einer
                            anderen Dauer als berechnet. Bitte passen Sie Ihr
                            monatliches Sparen entsprechend an.
                          </strong>
                        </Alert>
                      </Collapse>
                    </Box>
                  </>
                )}
                <StyledTextField
                  required
                  fullWidth
                  label="Monatliches Sparen"
                  name="monthly_saving"
                  value={savingGoal.monthly_saving}
                  onChange={handleChange}
                />
                <StyledTextField
                  required
                  fullWidth
                  label="Gesamtbetrag"
                  name="total_amount"
                  value={savingGoal.total_amount}
                  onChange={handleChange}
                />
                <StyledTextField
                  required
                  fullWidth
                  label="Beschreibung"
                  name="description"
                  value={savingGoal.description}
                  onChange={handleChange}
                />
                <StyledTextField
                  fullWidth
                  label="Startdate (optional)"
                  name="startdate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={savingGoal.startdate}
                  onChange={handleChange}
                />
                <StyledTextField
                  fullWidth
                  label="Deadline (optional)"
                  name="deadline"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={savingGoal.deadline}
                  onChange={handleChange}
                />
                <StyledTextField
                  required
                  fullWidth
                  label="Dauer in Monaten"
                  name="duration"
                  value={savingGoal.duration}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sparziel setzen
                </Button>
              </Box>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#262b3d" }}>
              <Button
                onClick={handleClose}
                color="primary"
                sx={{ color: "#e0e3e9" }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSubmit}
                color="button"
                sx={{ color: "#e0e3e9" }}
              >
                Speichern
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ my: 2 }}>
            {goals.map((goal, index) => (
              <StyledCard key={goal.id} sx={{ position: "relative" }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                        <strong>{goal.description}</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        color="#d1d1d1"
                        gutterBottom
                      >
                        <strong>Monatliches Sparen: </strong>{" "}
                        {goal.monthly_saving} €
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        color="#d1d1d1"
                        gutterBottom
                      >
                        <strong>Gesamtbetrag:</strong> {goal.total_amount} €
                      </Typography>
                      <div>
                        <Chip
                          sx={{ color: "#e0e3e9", mr: 1, mb: 2 }}
                          label={`vom: ${new Date(
                            goal.startdate
                          ).toLocaleDateString()}`}
                        />
                        <Chip
                          sx={{ color: "#e0e3e9", mb: 2 }}
                          label={`bis: ${
                            goal.deadline
                              ? new Date(goal.deadline).toLocaleDateString()
                              : "Keine"
                          }`}
                        />
                      </div>
                      <Typography
                        variant="body2"
                        component="div"
                        color="#d1d1d1"
                      >
                        <strong>Dauer:</strong> {goal.duration} Monate
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <IconButton
                        onClick={() => handleDelete(goal.id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#e0e3e9",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SavingPage;
