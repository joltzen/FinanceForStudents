import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import AddButton from "../../components/AddButtonComp";
import CardComp from "../../components/CardComp";
import LinearProgressComp from "../../components/LinearProgressComp";
import TextComp from "../../components/TextComp";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";

function SavingPage() {
  const today = new Date().toISOString().split("T")[0];
  const theme = useTheme();

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

      const diffTime = Math.abs(enteredDeadline - startDate);
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

      if (diffMonths <= (parseInt(updatedGoal.duration, 10) || 0)) {
        setAlertDuration(true);
        return;
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
      await axiosInstance.post("/saving-goals", savingGoalData);
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
  const handleOpen = () => {
    setOpen(!open);
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
      if (response.data) {
        setGoals(goals.filter((goal) => goal.id !== goalId));
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Sparziels", error);
    }
  };
  function calculateSavingsProgress(goal) {
    const today = new Date();
    const startdate = new Date(goal.startdate);
    const diffTime = Math.abs(today - startdate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // -1 to exclude the last month

    const totalSavedSoFar = diffMonths * parseFloat(goal.monthly_saving);
    const totalGoalAmount = parseFloat(goal.total_amount);

    const progressPercentage = (totalSavedSoFar / totalGoalAmount) * 100;

    return Math.min(progressPercentage, 100); // Ensure it doesn't exceed 100%
  }

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
            onClick={handleOpen}
            startIcon={<AddCircleOutlineIcon />}
          >
            Sparziel hinzufügen
          </AddButton>
          <Dialog open={open} onClose={handleOpen}>
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.card.main,
                color: theme.palette.text.main,
              }}
            >
              Sparziel setzen
            </DialogTitle>
            <DialogContent
              sx={{
                backgroundColor: theme.palette.card.main,
              }}
            >
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
                <InputLabel
                  sx={{ color: theme.palette.text.main, mt: 2 }}
                  id="category-label"
                >
                  Monatliches Sparen *
                </InputLabel>
                <TextComp
                  required
                  fullWidth
                  name="monthly_saving"
                  value={savingGoal.monthly_saving}
                  onChange={handleChange}
                />
                <InputLabel
                  sx={{ color: theme.palette.text.main, mt: 2 }}
                  id="category-label"
                >
                  Gesamtbetrag *
                </InputLabel>
                <TextComp
                  required
                  fullWidth
                  name="total_amount"
                  value={savingGoal.total_amount}
                  onChange={handleChange}
                />
                <InputLabel
                  sx={{ color: theme.palette.text.main, mt: 2 }}
                  id="category-label"
                >
                  Beschreibung
                </InputLabel>
                <TextComp
                  required
                  fullWidth
                  name="description"
                  value={savingGoal.description}
                  onChange={handleChange}
                />
                <InputLabel
                  sx={{ color: theme.palette.text.main, mt: 2 }}
                  id="category-label"
                >
                  Startdatum
                </InputLabel>
                <TextComp
                  fullWidth
                  name="startdate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={savingGoal.startdate}
                  onChange={handleChange}
                />
                <InputLabel
                  sx={{ color: theme.palette.text.main, mt: 2 }}
                  id="category-label"
                >
                  Deadline
                </InputLabel>
                <TextComp
                  fullWidth
                  name="deadline"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={savingGoal.deadline}
                  onChange={handleChange}
                />
                <InputLabel
                  sx={{ color: theme.palette.text.main, mt: 2 }}
                  id="category-label"
                >
                  Dauer in Monaten
                </InputLabel>
                <TextComp
                  required
                  fullWidth
                  name="duration"
                  value={savingGoal.duration}
                  onChange={handleChange}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: theme.palette.card.main }}>
              <Button
                onClick={handleOpen}
                sx={{
                  color: theme.palette.text.main,
                  bg: theme.palette.primary.main,
                }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSubmit}
                sx={{
                  color: theme.palette.text.main,
                  bg: theme.palette.primary.main,
                }}
              >
                Speichern
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ my: 2 }}>
            {goals.map((goal, index) => (
              <CardComp key={goal.id} sx={{ position: "relative" }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                        <strong>{goal.description}</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        color={theme.palette.savetext.main}
                        gutterBottom
                      >
                        <strong>Monatliches Sparen: </strong>{" "}
                        {goal.monthly_saving} €
                      </Typography>
                      <Typography
                        variant="body2"
                        component="div"
                        color={theme.palette.savetext.main}
                        gutterBottom
                      >
                        <strong>Gesamtbetrag:</strong> {goal.total_amount} €
                      </Typography>
                      <div>
                        <Chip
                          sx={{ color: theme.palette.text.main, mr: 1, mb: 2 }}
                          label={`vom: ${new Date(
                            goal.startdate
                          ).toLocaleDateString()}`}
                        />
                        <Chip
                          sx={{ color: theme.palette.text.main, mb: 2 }}
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
                        sx={{ color: theme.palette.savetext.main }}
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
                          color: theme.palette.text.main,
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ mt: 1, color: theme.palette.text.main }}
                  >
                    <strong>Ersparnisfortschritt:</strong>
                  </Typography>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgressComp
                      variant="determinate"
                      value={calculateSavingsProgress(goal)}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.main }}
                  >
                    {`${calculateSavingsProgress(goal).toFixed(2)}%`}
                  </Typography>
                </CardContent>
              </CardComp>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SavingPage;
