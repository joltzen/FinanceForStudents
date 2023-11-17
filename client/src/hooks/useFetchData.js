// useFetchData.js
import { useState, useEffect } from "react";
import axiosInstance from "../config/axios";

export const useFetchData = (user, isAnnualView, filterMonth, filterYear) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [prevMonthTransactions, setPrevMonthTransactions] = useState([]);
  const [prevSettings, setPrevSettings] = useState([]);
  const [prevSavingsGoals, setPrevSavingsGoals] = useState([]);
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

    fetchTransactionsAndSettings();
    fetchPrevoiusMonthTransactions();
    fetchPrevoiusMonthSettings();
    fetchCategories();
    fetchSavingGoals();
  }, [filterMonth, filterYear, isAnnualView, user.id]);

  return {
    prevMonthTransactions,
    prevSettings,
    transactions,
    categories,
    settings,
    savingsGoals,
  };
};
