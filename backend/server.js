import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env") });
import { connectDb } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";
import { seedIfNeeded } from "./seed.js";
import { authRouter } from "./routes/auth.js";
import { bookingRouter } from "./routes/bookings.js";
import { contactRouter } from "./routes/contact.js";
import { reviewRouter } from "./routes/reviews.js";
import { roomRouter } from "./routes/rooms.js";
import { staffRouter } from "./routes/staff.js";

const app = express();
const origin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin/staff", staffRouter);

app.use(errorHandler);

const port = Number(process.env.PORT || 5000);

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  await connectDb();
  await seedIfNeeded();
  app.listen(port, () => {
    console.log(`API listening on ${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
