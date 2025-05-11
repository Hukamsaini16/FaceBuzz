
import express from "express";
import {
  registerStudent,
  verifyStudent,
  getStudentsByClassId,
  studentCount,
  deleteStudent,
  markStudentAttendance,
  getMonthlyStudentAttendance
} from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register",authMiddleware, registerStudent);
router.post("/verify",authMiddleware, verifyStudent);
router.get("/class/:classId",authMiddleware, getStudentsByClassId);
router.get("/students/count",authMiddleware, studentCount);
router.delete("/students/:studentId",authMiddleware, deleteStudent);
router.post("/mark-attendance",authMiddleware, markStudentAttendance);
router.get("/monthly-attendance",authMiddleware, getMonthlyStudentAttendance);
export default router;



