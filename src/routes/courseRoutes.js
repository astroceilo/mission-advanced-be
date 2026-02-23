import express from "express";
import { getCourses } from "../controllers/courseControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getCourses);

export default router;