import express from "express";
import {
  createClassroom,
  getAllClassrooms,
  deleteClassroom,
  getClassroomById,
  verifyclassroompassword,
  AllClassroomsbyname,
  getClassroomByobjectid
} from "../controllers/classroomController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create",authMiddleware, createClassroom);
router.get("/",authMiddleware, getAllClassrooms);
router.get("/getall",authMiddleware, AllClassroomsbyname);
router.post("/verify-password",authMiddleware,verifyclassroompassword);
router.get("/:id",authMiddleware, getClassroomById);
router.get("/classrooms/:classId",authMiddleware, getClassroomByobjectid);
router.delete("/:id",authMiddleware, deleteClassroom);

export default router;
