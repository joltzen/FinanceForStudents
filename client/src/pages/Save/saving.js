/* Copyright (c) 2023, Jason Oltzen */

import Add from "@mui/icons-material/Add";
import { Card, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import AddButton from "../../components/AddButtonComp";
import axiosInstance from "../../config/axios";
import { useAuth } from "../../core/auth/auth";
import SavingCards from "./card";
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
    <Grid container>
      <AddButton variant="contained" onClick={handleOpen} startIcon={<Add />}>
        Sparziel hinzufügen
      </AddButton>

      {goals.map((goal, index) => (
        <Grid item xs={12} md={6} lg={4} key={goal.id || index}>
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
      ))}

      <SavingDialog
        open={open}
        handleOpen={handleOpen}
        handleSubmit={handleSubmit}
        alter={alter}
        alterDuaation={alterDuration}
        savingGoal={savingGoal}
        handleChange={handleChange}
      />
    </Grid>
  );
}

export default SavingPage;
