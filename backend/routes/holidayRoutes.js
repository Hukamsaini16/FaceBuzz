import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getHolidays, getMonthlyHolidays, setHolidays } from "../controllers/holidayController.js";

const router = express.Router();

router.post("/set",authMiddleware,setHolidays );
router.get("/",authMiddleware, getHolidays); 
router.get("/month",authMiddleware, getMonthlyHolidays);// Optional: pass ?month=YYYY-MM

export default router;
