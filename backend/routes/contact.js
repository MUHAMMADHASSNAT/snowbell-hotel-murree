import { Router } from "express";
import { createContact, deleteMessage, listMessages, markRead } from "../controllers/contactController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const contactRouter = Router();
contactRouter.post("/", createContact);
contactRouter.get("/", requireAuth, requireRole("admin"), listMessages);
contactRouter.patch("/:id/read", requireAuth, requireRole("admin"), markRead);
contactRouter.delete("/:id", requireAuth, requireRole("admin"), deleteMessage);
