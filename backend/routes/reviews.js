import { Router } from "express";
import {
  createReview,
  deleteReview,
  listAdminReviews,
  listPublicReviews,
  moderateReview,
} from "../controllers/reviewController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const reviewRouter = Router();
reviewRouter.get("/", listPublicReviews);
reviewRouter.post("/", createReview);
reviewRouter.get("/admin", requireAuth, requireRole("admin"), listAdminReviews);
reviewRouter.patch("/:id", requireAuth, requireRole("admin"), moderateReview);
reviewRouter.delete("/:id", requireAuth, requireRole("admin"), deleteReview);
