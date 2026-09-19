import { hotel } from "../data/hotel";
import type { RoomAvailability } from "../types";

const pkr = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

export function formatPKR(amount: number) {
  return pkr.format(amount);
}

export function availabilityLabel(status: RoomAvailability) {
  if (status === "available") return "Available";
  if (status === "limited") return "Limited availability";
  if (status === "fullyBooked") return "Fully booked";
  if (status === "maintenance") return "Maintenance";
  if (status === "cleaning") return "Cleaning";
  return "Currently unavailable";
}

export function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function whatsappUrl(message: string) {
  const href = hotel.social.find((item) => item.label === "WhatsApp")?.href || "";
  const base = href.split("?")[0];
  return `${base}?text=${encodeURIComponent(message)}`;
}
