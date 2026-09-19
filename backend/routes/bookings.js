import { Router } from "express";
import {
  createBooking,
  dashboard,
  getBooking,
  listAdminBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const bookingRouter = Router();
bookingRouter.post("/", createBooking);
bookingRouter.get("/admin", requireAuth, requireRole("admin", "receptionist"), listAdminBookings);
bookingRouter.get("/dashboard", requireAuth, requireRole("admin", "receptionist"), dashboard);
bookingRouter.get("/:id", getBooking);
bookingRouter.patch("/:id/status", requireAuth, requireRole("admin", "receptionist"), updateBookingStatus);
