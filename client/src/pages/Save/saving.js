/* Copyright (c) 2023, Jason Oltzen */

import Add from "@mui/icons-material/Add";
import { Alert, Button, Card, Grid, Snackbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import AddButton from "../../components/AddButtonComp";
import { useAuth } from "../../core/auth/auth";
import {
  addSavingGoal,
  deleteSavingGoal,
  getSavingGoals,
} from "../../services/db";
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
    monthly_saving: "", total_amount: "", description: "",
    startdate: today, deadline: "", duration: "",
  });
  const [alert, setAlert] = useState(false);
  const [alertDuration, setAlertDuration] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState(null);

  const fetchGoals = async () => {
    try {
      setGoals(await getSavingGoals(user.id));
    } catch (error) {
      console.error("Fehler beim Abrufen der Sparziele", error);
    }
  };

  useEffect(() => { fetchGoals(); }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...savingGoal, [name]: value };

    if (name === "duration") {
      const months = parseInt(value, 10) || 0;
      const total = parseFloat(updated.total_amount) || 0;
      updated.monthly_saving = months > 0 ? (total / months).toString() : "0";
      if (updated.startdate) {
        const d = new Date(updated.startdate);
        d.setMonth(d.getMonth() + months);
        updated.deadline = d.toISOString().split("T")[0];
      }
    }
    if (name === "monthly_saving" || name === "total_amount") {
      const monthly = parseFloat(updated.monthly_saving) || 0;
      const total = parseFloat(updated.total_amount) || 0;
      const dur = monthly > 0 ? Math.ceil(total / monthly) : 0;
      updated.duration = dur.toString();
      if (updated.startdate) {
        const d = new Date(updated.startdate);
        d.setMonth(d.getMonth() + dur);
        updated.deadline = d.toISOString().split("T")[0];
      }
    }
    setSavingGoal(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (savingGoal.deadline && new Date(savingGoal.deadline) < new Date(savingGoal.startdate)) {
      setAlert(true);
      return;
    }
    try {
      await addSavingGoal(user.id, { ...savingGoal, user_id: user.id });
      setSavingGoal({ monthly_saving: "", total_amount: "", description: "", startdate: today, deadline: "", duration: "" });
      setOpen(false);
      setSnackbarMessage("Sparziel erfolgreich hinzugefügt!");
      setSnackbarSeverity("success");
      fetchGoals();
    } catch (error) {
      console.error("Fehler beim Speichern des Sparziels", error);
      setSnackbarMessage("Fehler beim Hinzufügen des Sparziels!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const deleteSaving = async (goalId) => {
    try {
      await deleteSavingGoal(user.id, goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      setSnackbarMessage("Sparziel erfolgreich gelöscht!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Fehler beim Löschen des Sparziels", error);
      setSnackbarMessage("Fehler beim Löschen des Sparziels!");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  function calculateSavingsProgress(goal) {
    const today = new Date();
    const startdate = new Date(goal.startdate);
    const deadline = new Date(goal.deadline);
    if (today < startdate) return 0;
    const elapsed = Math.ceil(Math.abs(today - startdate) / (1000 * 60 * 60 * 24 * 30));
    const total = Math.ceil(Math.abs(deadline - startdate) / (1000 * 60 * 60 * 24 * 30));
    const saved = elapsed * parseFloat(goal.monthly_saving);
    return Math.min((saved / parseFloat(goal.total_amount)) * 100, 100);
  }

  return (
    <Grid container>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {goals.length > 0
        ? <AddButton variant="contained" onClick={() => setOpen(!open)} startIcon={<Add />}>Sparziel hinzufügen</AddButton>
        : null}
      {goals.length > 0
        ? goals.map((goal, index) => (
          <Grid item xs={12} md={6} lg={3} key={goal.id || index}>
            <Card sx={{ backgroundColor: theme.palette.card.main, margin: 2, borderRadius: 5 }}>
              <SavingCards goal={goal} handleDelete={(id) => { setDeletingGoalId(id); setOpenConfirmDialog(true); }}
                calculateSavingsProgress={calculateSavingsProgress} theme={theme} />
            </Card>
          </Grid>
        ))
        : (
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: theme.palette.card.main, margin: 2, borderRadius: 5, padding: 2, textAlign: "center" }}>
              <Typography variant="h6">Es sind noch keine Sparziele vorhanden!</Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Fügen ein neues Sparziel hinzu, um loszulegen!</Typography>
              <Button variant="contained" onClick={() => setOpen(!open)} sx={{ mt: 10 }}>Sparziel hinzufügen</Button>
            </Card>
          </Grid>
        )}
      <SavingDialog open={open} handleOpen={() => setOpen(!open)} handleSubmit={handleSubmit}
        alter={alert} alterDuaation={alertDuration} savingGoal={savingGoal} handleChange={handleChange} />
      <DeleteDialog openConfirmDialog={openConfirmDialog} setOpenConfirmDialog={setOpenConfirmDialog}
        confirmDelete={async () => { setOpenConfirmDialog(false); await deleteSaving(deletingGoalId); }}
        deletingGoalId={deletingGoalId} />
    </Grid>
  );
}

export default SavingPage;
