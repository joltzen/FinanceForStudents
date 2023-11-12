import axiosInstance from "../config/axios";
import { useCallback } from "react";

const useSettings = (setTransactions) => {
  const handleDeleteSettings = useCallback(
    async (settingsId) => {
      try {
        await axiosInstance.delete("/deleteSettings", {
          params: { id: settingsId },
        });
        setTransactions((prevTransactions) =>
          prevTransactions.filter(
            (transaction) => transaction.settings_id !== settingsId
          )
        );
      } catch (error) {
        console.error("Fehler beim Löschen der Settings:", error);
      }
    },
    [setTransactions]
  );

  return {
    handleDeleteSettings,
  };
};

export default useSettings;
