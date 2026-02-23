import express from "express";
import { getCourses } from "../controllers/courseControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { sendResponse } from "../utils/response.js";

const router = express.Router();

router.get("/", verifyToken, getCourses);

router.post("/upload", verifyToken, upload.single("file"), (req, res) => {
  return sendResponse(res, {
    success: true,
    message: "File uploaded successfully",
    data: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    },
    status: 200,
  });
});

export default router;
