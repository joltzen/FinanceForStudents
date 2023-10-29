import express from "express";
import syncDashboard from "./dashboard";

const router = express.Router();

// default route
router.use("/dashboard", syncDashboard);

export { router as default };
