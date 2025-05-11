import express from "express";
import { faceLogin } from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", faceLogin);

export default router;
