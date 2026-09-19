import type { Review } from "../types";

/** Demo/sample reviews only. Replace this array with API/database results later. */
export const reviews: Review[] = [
  {
    id: "demo-1",
    name: "Ayesha K.",
    rating: 5,
    text: "Clean room, heating worked through a cold night, and the desk helped us time a Mall Road walk. Sample review for the website.",
    stayMonth: "March 2025",
    isDemo: true,
  },
  {
    id: "demo-2",
    name: "Usman R.",
    rating: 4,
    text: "Straightforward stay after the drive from Islamabad. Backup power during a short outage. This is demo content.",
    stayMonth: "December 2024",
    isDemo: true,
  },
  {
    id: "demo-3",
    name: "Hira S.",
    rating: 5,
    text: "Family suite had enough space for the children. Hot water in the morning was consistent. Sample guest comment.",
    stayMonth: "July 2025",
    isDemo: true,
  },
  {
    id: "demo-4",
    name: "Bilal M.",
    rating: 4,
    text: "Quiet enough to sleep after a long day. WiFi was fine for messages. Demo review — not a live booking record.",
    stayMonth: "January 2025",
    isDemo: true,
  },
];

export function averageRating(list: Review[]) {
  if (list.length === 0) return 0;
  return list.reduce((sum, item) => sum + item.rating, 0) / list.length;
}
