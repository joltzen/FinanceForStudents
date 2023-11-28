/* Copyright (c) 2023, Jason Oltzen */

import Add from "@mui/icons-material/Add";
import { Alert, Button, Card, Grid, Snackbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import AddButton from "../../components/AddButtonComp";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import SavingCards from "./card";
import DeleteDialog from "./delete";
import SavingDialog from "./dialog";

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
  const [alert, setAlert] = useState(false);
  const [alertDuration, setAlertDuration] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedGoal = { ...savingGoal, [name]: value };

    // Berechnung basierend auf Änderungen an der monatlichen Dauer
    if (name === "duration") {
      const durationMonths = parseInt(value, 10) || 0;
      const totalAmount = parseFloat(updatedGoal.total_amount) || 0;

      const monthlySaving =
        durationMonths > 0 ? totalAmount / durationMonths : 0;
      updatedGoal = {
        ...updatedGoal,
        monthly_saving: monthlySaving.toString(),
      };

      const startDate = updatedGoal.startdate
        ? new Date(updatedGoal.startdate)
        : new Date();
      startDate.setMonth(startDate.getMonth() + durationMonths);
      updatedGoal = {
        ...updatedGoal,
        deadline: startDate.toISOString().split("T")[0],
      };
    }

    if (name === "monthly_saving" || name === "total_amount") {
      const monthlySaving = parseFloat(updatedGoal.monthly_saving) || 0;
      const totalAmount = parseFloat(updatedGoal.total_amount) || 0;
      const duration =
        monthlySaving > 0 ? Math.ceil(totalAmount / monthlySaving) : 0;
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
      setSnackbarMessage("Sparziel erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Fehler beim Speichern des Sparziels", error);
      setSnackbarMessage("Fehler beim hinzufügen des Sparziels!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
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

  const handleDelete = (goalId) => {
    setDeletingGoalId(goalId);
    setOpenConfirmDialog(true);
  };

  const deleteSaving = async (goalId) => {
    try {
      const response = await axiosInstance.delete("/delete-saving-goal", {
        params: { id: goalId },
      });
      if (response.data) {
        setGoals(goals.filter((goal) => goal.id !== goalId));
      }
      setSnackbarMessage("Sparziel erfolgreich gelöscht!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Fehler beim Löschen des Sparziels", error);
      setSnackbarMessage("Fehler beim löschen des Sparziels!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const confirmDelete = async () => {
    setOpenConfirmDialog(false);
    // Hier rufen Sie die ursprüngliche handleDelete Funktion mit deletingGoalId auf
    await deleteSaving(deletingGoalId);
  };
  function calculateSavingsProgress(goal) {
    const today = new Date();
    const startdate = new Date(goal.startdate);
    const deadline = new Date(goal.deadline);

    if (today < startdate) {
      return 0;
    }
    const diffTimeStart = Math.abs(today - startdate);
    const diffTimeTotal = Math.abs(deadline - startdate);
    const elapsedMonths = Math.ceil(diffTimeStart / (1000 * 60 * 60 * 24 * 30));
    const totalMonths = Math.ceil(diffTimeTotal / (1000 * 60 * 60 * 24 * 30));
    const totalSavedSoFar = elapsedMonths * parseFloat(goal.monthly_saving);
    const totalGoalAmount = parseFloat(goal.total_amount);
    const progressPercentage = (totalSavedSoFar / totalGoalAmount) * 100;
    return Math.min(progressPercentage, 100);
  }
  return (
    <Grid container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {goals.length > 0 ? (
        <AddButton variant="contained" onClick={handleOpen} startIcon={<Add />}>
          Sparziel hinzufügen
        </AddButton>
      ) : (
        <></>
      )}
      {goals.length > 0 ? (
        goals.map((goal, index) => (
          <Grid item xs={12} md={6} lg={3} key={goal.id || index}>
            <Card
              sx={{
                backgroundColor: theme.palette.card.main,
                margin: 2,
                borderRadius: 5,
              }}
            >
              <SavingCards
                goal={goal}
                handleDelete={handleDelete}
                calculateSavingsProgress={calculateSavingsProgress}
                theme={theme}
              />
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: theme.palette.card.main,
              margin: 2,
              borderRadius: 5,
              padding: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">
              Es sind noch keine Sparziele vorhanden!
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Fügen ein neues Sparziel hinzu, um loszulegen!
            </Typography>
            <Button variant="contained" onClick={handleOpen} sx={{ mt: 10 }}>
              Sparziel hinzufügen
            </Button>
          </Card>
        </Grid>
      )}
      <SavingDialog
        open={open}
        handleOpen={handleOpen}
        handleSubmit={handleSubmit}
        alter={alert}
        alterDuaation={alertDuration}
        savingGoal={savingGoal}
        handleChange={handleChange}
      />
      <DeleteDialog
        openConfirmDialog={openConfirmDialog}
        setOpenConfirmDialog={setOpenConfirmDialog}
        confirmDelete={confirmDelete}
        deletingGoalId={deletingGoalId}
      />
    </Grid>
  );
}

export default SavingPage;
