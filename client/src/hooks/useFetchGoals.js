/* Copyright (c) 2023, Jason Oltzen */

import { useCallback, useEffect, useState } from "react";
import {
  addSavingGoal,
  deleteSavingGoal,
  getSavingGoals,
} from "../services/db";

const useSavingGoals = (userId) => {
  const [goals, setGoals] = useState([]);

  const fetchGoals = useCallback(async () => {
    try {
      setGoals(await getSavingGoals(userId));
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
        await addSavingGoal(userId, goalData);
        fetchGoals();
      } catch (error) {
        console.error("Fehler beim Speichern des Sparziels", error);
      }
    },
    [userId, fetchGoals]
  );

  const deleteGoal = useCallback(
    async (goalId) => {
      try {
        await deleteSavingGoal(userId, goalId);
        setGoals((prev) => prev.filter((g) => g.id !== goalId));
      } catch (error) {
        console.error("Fehler beim Löschen des Sparziels", error);
      }
    },
    [userId]
  );

  return { goals, addGoal, deleteGoal, fetchGoals };
};

export default useSavingGoals;
