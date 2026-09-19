import { Router } from "express";
import {
  availability,
  createRoom,
  deactivateRoom,
  listAdminRooms,
  listPublicRooms,
  updateRoom,
} from "../controllers/roomController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const roomRouter = Router();
roomRouter.get("/", listPublicRooms);
roomRouter.get("/availability", availability);
roomRouter.get("/admin", requireAuth, requireRole("admin", "receptionist"), listAdminRooms);
roomRouter.post("/", requireAuth, requireRole("admin"), createRoom);
roomRouter.patch("/:id", requireAuth, requireRole("admin"), updateRoom);
roomRouter.delete("/:id", requireAuth, requireRole("admin"), deactivateRoom);
