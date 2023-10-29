import express from "express";
import syncs from "./syncs";

const router = express.Router();

// default route
router.get("/", (_req, res) => {
  res
    .status(200)
    .json({
      message: "Welcome to FinanceForStudents",
      version: 1,
    })
    .end();
});

router.use("/syncs", syncs);

export { router as default };
