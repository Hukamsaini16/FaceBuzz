import express from "express";
import {
  registerAdmin,
  verifyAdmin,
  getAllAdmins,
  removeAdmin,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register",authMiddleware, registerAdmin);
router.post("/verify", verifyAdmin);
router.get("/admins",authMiddleware, getAllAdmins);
router.delete("/admins/:id",authMiddleware, removeAdmin);
export default router;
