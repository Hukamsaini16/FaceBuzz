
import express from "express";
import { getAllStudents, registerStudent, studentCount, verifyStudent } from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/verify", verifyStudent);

router.get("/students/count", studentCount);
router.get("/students", getAllStudents);

export default router;


