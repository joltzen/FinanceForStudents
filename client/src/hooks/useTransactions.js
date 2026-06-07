/* Copyright (c) 2026, Jason Oltzen */

import { useCallback } from "react";
import { deleteTransaction } from "../services/db";

const useTransactions = (userId, setTransactions) => {
  const handleDeleteTransaction = useCallback(
    async (transactionId) => {
      try {
        await deleteTransaction(userId, transactionId);
        setTransactions((prev) =>
          prev.filter((t) => t.transaction_id !== transactionId),
        );
      } catch (error) {
        console.error("Fehler beim Löschen der Transaktion:", error);
      }
    },
    [userId, setTransactions],
  );

  return { handleDeleteTransaction };
};

export default useTransactions;
