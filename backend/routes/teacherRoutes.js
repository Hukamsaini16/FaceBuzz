import express from "express";
import {
  registerTeacher,
  verifyTeacher,
  getAllTeachers,
  getMonthlyTeacherAttendance,
  removeTeacher,
  saveTeacherAttendance,
} from "../controllers/teacherController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register",authMiddleware, registerTeacher);
router.post("/verify", verifyTeacher);
router.get("/teachers",authMiddleware, getAllTeachers);
router.get("/monthly-attendance",authMiddleware, getMonthlyTeacherAttendance);
router.post("/teachers/mark-attendance",authMiddleware, saveTeacherAttendance);
router.delete("/teachers/:id",authMiddleware, removeTeacher);

export default router;
