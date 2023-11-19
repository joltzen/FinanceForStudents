/* Copyright (c) 2023, Jason Oltzen */

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../config/axios";

const useSavingGoals = (userId) => {
  const [goals, setGoals] = useState([]);

  const fetchGoals = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-saving-goals", {
        params: { userId },
      });
      setGoals(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Sparziele", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(
    async (goalData) => {
      try {
        await axiosInstance.post("/saving-goals", goalData);
        fetchGoals(); // Erneutes Abrufen der Ziele nach dem Hinzufügen
      } catch (error) {
        console.error("Fehler beim Speichern des Sparziels", error);
      }
    },
    [fetchGoals]
  );

  const deleteGoal = useCallback(async (goalId) => {
    try {
      await axiosInstance.delete("/delete-saving-goal", {
        params: { id: goalId },
      });
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
    } catch (error) {
      console.error("Fehler beim Löschen des Sparziels", error);
    }
  }, []);

  return { goals, addGoal, deleteGoal, fetchGoals };
};

export default useSavingGoals;
