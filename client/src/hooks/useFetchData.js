// useFetchData.js
import { useEffect, useState } from "react";
import axiosInstance from "../config/axios";

export const useFetchData = (user, isAnnualView, filterMonth, filterYear) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [prevMonthTransactions, setPrevMonthTransactions] = useState([]);
  const [prevSettings, setPrevSettings] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [allSettings, setAllSettings] = useState([]);
  const [allSaving, setAllSaving] = useState([]);
  useEffect(() => {
    const fetchTransactionsAndSettings = async () => {
      const endpointTransactions = isAnnualView
        ? "/getTransactionsAnnual"
        : "/getTransactions";
      const endpointSettings = isAnnualView
        ? "/getSettingsAnnual"
        : "/getSettings";
      const params = { year: filterYear, user_id: user.id };
      if (!isAnnualView) {
        params.month = filterMonth;
      }

      try {
        const [transactionsResponse, settingsResponse] = await Promise.all([
          axiosInstance.get(endpointTransactions, { params }),
          axiosInstance.get(endpointSettings, { params }),
        ]);

        setTransactions(transactionsResponse.data);
        setSettings(settingsResponse.data);
      } catch (error) {
        console.error("Error fetching transactions and settings:", error);
      }
    };

    const fetchPrevoiusMonthTransactions = async () => {
      try {
        const response = await axiosInstance.get("/getTransactions", {
          params: {
            year: filterMonth === 1 ? filterYear - 1 : filterYear,
            month: filterMonth - 1,
            user_id: user.id,
          },
        });

        setPrevMonthTransactions(response.data);
      } catch (error) {
        console.error("Error fetching previous month transactions:", error);
      }
    };

    const fetchPrevoiusMonthSettings = async () => {
      try {
        const response = await axiosInstance.get("/getSettings", {
          params: {
            year: filterMonth === 1 ? filterYear - 1 : filterYear,
            month: filterMonth - 1,
            user_id: user.id,
          },
        });

        setPrevSettings(response.data);
      } catch (error) {
        console.error("Error fetching previous month settings:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/getCategories", {
          params: { user_id: user.id },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    const fetchSavingGoals = async () => {
      try {
        const response = await axiosInstance.get("/get-saving-goals", {
          params: { userId: user.id },
        });
        setSavingsGoals(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Sparziele", error);
      }
    };

    const fetchAllUserTransactions = async () => {
      try {
        const response = await axiosInstance.get("/getAllTransactions", {
          params: { user_id: user.id },
        });

        setAllTransactions(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Transaktionen:", error);
      }
    };

    const fetchAllUserSettings = async () => {
      try {
        const response = await axiosInstance.get("/getAllSettings", {
          params: { user_id: user.id },
        });
        setAllSettings(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Einstellungen:", error);
      }
    };

    const fetchAllUserSaving = async () => {
      try {
        const response = await axiosInstance.get("/get-saving-goals", {
          params: { userId: user.id },
        });
        setAllSaving(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Sparziele:", error);
      }
    };

    fetchAllUserTransactions();
    fetchTransactionsAndSettings();
    fetchPrevoiusMonthTransactions();
    fetchPrevoiusMonthSettings();
    fetchCategories();
    fetchSavingGoals();
    fetchAllUserSettings();
    fetchAllUserSaving();
    fetchAllUserTransactions();
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
