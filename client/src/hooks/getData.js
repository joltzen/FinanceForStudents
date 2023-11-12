import axiosInstance from "../config/axios";

const getTransactions = async (filterMonth, filterYear, userId) => {
  const response = await axiosInstance.get("/getUserTransactions", {
    params: {
      month: filterMonth,
      year: filterYear,
      user_id: userId,
    },
  });
  return response.data;
};

const getSettings = async (filterMonth, filterYear, userId) => {
  const response = await axiosInstance.get("/getSettings", {
    params: {
      month: filterMonth,
      year: filterYear,
      user_id: userId,
    },
  });
  return response.data;
};

const getCategories = async (userId) => {
  const response = await axiosInstance.get("/getCategories", {
    params: { user_id: userId },
  });
  return response.data;
};

const getSavingGoals = async (userId) => {
  const response = await axiosInstance.get("/get-saving-goals", {
    params: { userId: userId },
  });
  return response.data;
};
export { getTransactions, getSettings, getCategories, getSavingGoals };
