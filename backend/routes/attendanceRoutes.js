import express from "express";
import {
  storeDailyAttendanceSummary,
  getStudentsTodaySummary,
  getClassroomWiseAttendance,
} from "../controllers/attendanceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/summary", storeDailyAttendanceSummary);
router.get("/students-today-summary",authMiddleware, getStudentsTodaySummary);
router.get("/summary/classrooms", getClassroomWiseAttendance);

export default router;
