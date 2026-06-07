/* Copyright (c) 2023, Jason Oltzen */

import { useCallback } from "react";
import { deleteSettings } from "../services/db";

const useSettings = (userId, setTransactions) => {
  const handleDeleteSettings = useCallback(
    async (settingsId) => {
      try {
        await deleteSettings(userId, settingsId);
        setTransactions((prev) =>
          prev.filter((t) => t.settings_id !== settingsId)
        );
      } catch (error) {
        console.error("Fehler beim Löschen der Settings:", error);
      }
    },
    [userId, setTransactions]
  );

  return { handleDeleteSettings };
};

export default useSettings;
