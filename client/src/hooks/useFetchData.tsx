/* Copyright (c) 2026, Jason Oltzen */

import { useEffect, useState } from "react";
import {
  getAllSettings,
  getAllTransactions,
  getCategories,
  getSavingGoals,
  getSettings,
  getSettingsAnnual,
  getTransactions,
  getTransactionsAnnual,
} from "../services/db";

export const useFetchData = (user: any, isAnnualView: boolean, filterMonth: number, filterYear: number) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [prevMonthTransactions, setPrevMonthTransactions] = useState<any[]>([]);
  const [prevSettings, setPrevSettings] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [allSettings, setAllSettings] = useState<any[]>([]);
  const [allSaving, setAllSaving] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [txData, settingsData] = await Promise.all([
          isAnnualView
            ? getTransactionsAnnual(user.id, filterYear)
            : getTransactions(user.id, filterMonth, filterYear),
          isAnnualView
            ? getSettingsAnnual(user.id, filterYear)
            : getSettings(user.id, filterMonth, filterYear),
        ]);
        setTransactions(txData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Error fetching transactions and settings:", error);
      }
    };

    const fetchPrevMonth = async () => {
      try {
        const prevMonth = filterMonth === 1 ? 12 : filterMonth - 1;
        const prevYear = filterMonth === 1 ? filterYear - 1 : filterYear;
        const [txData, settingsData] = await Promise.all([
          getTransactions(user.id, prevMonth, prevYear),
          getSettings(user.id, prevMonth, prevYear),
        ]);
        setPrevMonthTransactions(txData);
        setPrevSettings(settingsData);
      } catch (error) {
        console.error("Error fetching previous month data:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        setCategories(await getCategories(user.id));
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    const fetchSavingGoals = async () => {
      try {
        const goals = await getSavingGoals(user.id);
        setSavingsGoals(goals);
        setAllSaving(goals);
      } catch (error) {
        console.error("Fehler beim Abrufen der Sparziele", error);
      }
    };

    const fetchAllTransactions = async () => {
      try {
        setAllTransactions(await getAllTransactions(user.id));
      } catch (error) {
        console.error("Fehler beim Laden der Transaktionen:", error);
      }
    };

    const fetchAllSettings = async () => {
      try {
        setAllSettings(await getAllSettings(user.id));
      } catch (error) {
        console.error("Fehler beim Laden der Einstellungen:", error);
      }
    };

    fetchAll();
    fetchPrevMonth();
    fetchCategories();
    fetchSavingGoals();
    fetchAllTransactions();
    fetchAllSettings();
  }, [filterMonth, filterYear, isAnnualView, user.id]);

  return {
    prevMonthTransactions,
    prevSettings,
    transactions,
    categories,
    settings,
    savingsGoals,
    allTransactions,
    allSettings,
    allSaving,
  };
};
