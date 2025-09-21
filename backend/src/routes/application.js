import express from "express";
import {
  applyForRole,
  getMyApplications,
  getAllApplications,
  reviewApplication,
  getPendingApplications
} from "../controllers/application.controller.js";
import { protectRoute } from "../middlewares/user.middleware.js";
import { upload } from "../lib/cloudinary.js";

const router = express.Router();

// User applies
router.post(
  "/apply",
  protectRoute,
  upload.fields([{ name: "pdf", maxCount: 1 }]),
  applyForRole
);

// User views their applications
router.get("/mine", protectRoute, getMyApplications);

// Admin views all applications
router.get("/", protectRoute, getAllApplications);

// Admin views only pending applications
router.get("/pending", protectRoute, getPendingApplications);

// Admin reviews an application
router.put("/:id/review", protectRoute, reviewApplication);

export default router;
