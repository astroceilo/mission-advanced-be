import express from "express";
import { getCourses } from "../controllers/courseControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { sendResponse } from "../utils/response.js";

import sharp from "sharp";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/", verifyToken, getCourses);

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, {
        success: false,
        message: "No file uploaded",
        status: 400,
      });
    }

    const originalPath = req.file.path;

    const webpFilename = path.parse(req.file.filename).name + ".webp";

    const webpPath = path.join("uploads", webpFilename);

    await sharp(originalPath)
      .resize(800) // optional resize width 800px
      .webp({ quality: 80 })
      .toFile(webpPath);

    // delete original file
    fs.unlinkSync(originalPath);

    return sendResponse(res, {
      success: true,
      message: "File uploaded & converted to WebP",
      data: {
        filename: webpFilename,
        path: `/uploads/${webpFilename}`,
      },
      status: 200,
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return sendResponse(res, {
      success: false,
      message: error.message,
      status: 400,
    });

    // return sendResponse(res, {
    //   success: false,
    //   message: error.message,
    //   status: 500,
    // });
  }
});

export default router;
