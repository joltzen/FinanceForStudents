// useFetchData.js
import { useState, useEffect } from "react";
import axiosInstance from "../config/axios";

export const useFetchData = (user, isAnnualView, filterMonth, filterYear) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  useEffect(() => {
    const fetchTransactionsAndSettings = async () => {
      const endpointTransactions = isAnnualView
        ? "/getUserTransactionsAnnual"
        : "/getUserTransactions";
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
    fetchCategories();
    fetchSavingGoals();
  }, [filterMonth, filterYear, isAnnualView, user.id]);

  return { transactions, categories, settings, savingsGoals };
};
