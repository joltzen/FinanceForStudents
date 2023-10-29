// router für /syncs exportiert

import express from "express";
import doshboard from "./dashboard";

const router = express.Router();

// default route
router.use("/doshboard", doshboard);

export { router as default };
