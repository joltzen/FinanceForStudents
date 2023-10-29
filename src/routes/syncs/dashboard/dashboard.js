import express from "express";
import { syncDashboard } from "../../../services/syncs/dashboard";

const router = express.Router();

// default route
router.post("/", async (_req, res) => {
  const result = await syncDashboard();
  console.log(result);
  res
    .status(200)
    .json({
      message: "Sync to BQ",
    })
    .end();
});

export { router as default };
