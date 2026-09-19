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

function corsOrigin(origin, callback) {
  if (!origin) {
    callback(null, true);
    return;
  }
  const allowed = new Set(
    [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean),
  );
  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL}`);
  }
  try {
    const host = new URL(origin).hostname;
    if (allowed.has(origin) || host.endsWith(".vercel.app")) {
      callback(null, true);
      return;
    }
  } catch {
    callback(null, false);
    return;
  }
  callback(null, false);
}

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

let ready;
async function ensureReady() {
  if (ready) return;
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  await connectDb();
  await seedIfNeeded();
  ready = true;
}

app.use((req, res, next) => {
  ensureReady().then(() => next()).catch(next);
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin/staff", staffRouter);

app.use(errorHandler);

export default app;

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 5000);
  ensureReady()
    .then(() => {
      app.listen(port, () => {
        console.log(`API listening on ${port}`);
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
