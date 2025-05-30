/* Copyright (c) 2023, Jason Oltzen */

import { useCallback } from "react";
import axiosInstance from "../config/axios";

const useTransactions = (setTransactions) => {
  const handleDeleteTransaction = useCallback(
    async (transactionId) => {
      try {
        await axiosInstance.delete("/deleteTransaction", {
          params: { id: transactionId },
        });
        setTransactions((prevTransactions) =>
          prevTransactions.filter(
            (transaction) => transaction.transaction_id !== transactionId
          )
        );
      } catch (error) {
        console.error("Fehler beim Löschen der Settings:", error);
      }
    },
    [setTransactions]
  );

  return {
    handleDeleteTransaction,
  };
};

export default useTransactions;
