/* Copyright (c) 2020-2021 CLOUDPILOTS Software & Consulting GmbH */

import express from "express";
import syncDashboard from "./dashboard";

const router = express.Router();

// default route
router.use("/dashboard", syncDashboard);

export { router as default };
