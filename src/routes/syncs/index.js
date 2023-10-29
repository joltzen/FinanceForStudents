/* Copyright (c) 2020-2021 CLOUDPILOTS Software & Consulting GmbH */

// router für /syncs exportiert

import express from "express";
import doshboard from "./dashboard";

const router = express.Router();

// default route
router.use("/doshboard", doshboard);

export { router as default };
