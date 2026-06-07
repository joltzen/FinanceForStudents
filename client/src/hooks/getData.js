/* Copyright (c) 2023, Jason Oltzen */

import {
  getCategories,
  getSavingGoals,
  getSettings,
  getTransactions,
} from "../services/db";

const getTransactionsData = async (filterMonth, filterYear, userId) => {
  return await getTransactions(userId, filterMonth, filterYear);
};

const getSettingsData = async (filterMonth, filterYear, userId) => {
  return await getSettings(userId, filterMonth, filterYear);
};

const getCategoriesData = async (userId) => {
  return await getCategories(userId);
};

const getSavingGoalsData = async (userId) => {
  return await getSavingGoals(userId);
};

export {
  getCategoriesData as getCategories,
  getSavingGoalsData as getSavingGoals,
  getSettingsData as getSettings,
  getTransactionsData as getTransactions,
};
