import type { HotelService } from "../types";

export const services: HotelService[] = [
  {
    id: "wifi",
    name: "WiFi",
    description: "Wireless internet in rooms and common areas for calls, maps, and work.",
    icon: "wifi",
  },
  {
    id: "electricity",
    name: "Electricity",
    description: "Standard in-room power for lighting, charging, and heating equipment.",
    icon: "zap",
  },
  {
    id: "backup",
    name: "Backup",
    description: "Backup supply on the property to cover the usual Murree load-shedding hours.",
    icon: "battery",
  },
  {
    id: "water",
    name: "Hot & Cold Water",
    description: "Ensuite bathrooms with hot and cold water for morning and evening use.",
    icon: "droplets",
  },
  {
    id: "heating",
    name: "Heating",
    description: "Room heating for cool evenings and winter visits to the Murree hills.",
    icon: "flame",
  },
  {
    id: "room-service",
    name: "Room Service",
    description: "In-room requests during advertised service hours — meals and extra linens.",
    icon: "bell",
  },
];
