import express from "express";
import { logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/logout", logoutUser);

export default router;
