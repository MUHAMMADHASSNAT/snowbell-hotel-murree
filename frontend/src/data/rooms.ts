import type { Room } from "../types";

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const rooms: Room[] = [
  {
    id: "standard-twin",
    name: "Standard Twin",
    slug: "standard-twin",
    description: "Two single beds in a compact room for friends or colleagues travelling together.",
    longDescription:
      "A practical twin room for two guests. Furnishings are simple: writing space, wardrobe, and an ensuite bathroom with hot and cold water. Suited to short Murree stays when you need a clean, heated room rather than extra living space.",
    capacity: 2,
    beds: "2 single beds",
    sizeSqFt: 220,
    facilities: ["Heating", "Hot & cold water", "WiFi", "TV", "Ensuite bathroom"],
    pricePerNight: 8500,
    availability: "available",
    image: img("photo-1631049307264-da0ec9d70304"),
    imageAlt: "Twin hotel room with two single beds and warm lighting",
    featured: true,
  },
  {
    id: "deluxe-double",
    name: "Deluxe Double",
    slug: "deluxe-double",
    description: "One double bed, extra floor space, and a quieter layout for couples.",
    longDescription:
      "The deluxe double is the usual choice for two adults. A larger room than the twin, with a double bed, seating, and the same core utilities: heating, backup power on the property, and ensuite facilities.",
    capacity: 2,
    beds: "1 double bed",
    sizeSqFt: 280,
    facilities: ["Heating", "Hot & cold water", "WiFi", "TV", "Seating area", "Ensuite bathroom"],
    pricePerNight: 12000,
    availability: "available",
    image: img("photo-1611892440504-42a792e24d32"),
    imageAlt: "Deluxe hotel room with a double bed and mountain-style interior",
    featured: true,
  },
  {
    id: "mountain-view",
    name: "Mountain View Double",
    slug: "mountain-view",
    description: "Double room placed for a better outlook over the surrounding hills.",
    longDescription:
      "Same comfort as the deluxe double, positioned on a higher floor or outward-facing side of the building for a wider hill view. Availability changes with season and weather; the booking page shows current mock status.",
    capacity: 2,
    beds: "1 double bed",
    sizeSqFt: 290,
    facilities: ["Hill view", "Heating", "Hot & cold water", "WiFi", "TV", "Ensuite bathroom"],
    pricePerNight: 15000,
    availability: "limited",
    image: img("photo-1566073771259-6a8506099945"),
    imageAlt: "Hotel room window looking toward pine-covered hills",
    featured: true,
  },
  {
    id: "family-suite",
    name: "Family Suite",
    slug: "family-suite",
    description: "Separate sleeping space for a small family, with room for children to settle in.",
    longDescription:
      "A larger unit for up to four guests. Useful for parents travelling with children who need more than a single room. Includes heating, an ensuite bathroom, and space for luggage after a drive up from the plains.",
    capacity: 4,
    beds: "1 double bed and 2 single beds",
    sizeSqFt: 420,
    facilities: ["Heating", "Hot & cold water", "WiFi", "TV", "Family layout", "Ensuite bathroom"],
    pricePerNight: 18500,
    availability: "available",
    image: img("photo-1582719478250-c89cae4dc85b"),
    imageAlt: "Spacious family hotel suite with sitting area",
  },
];

export function getRoomById(id: string) {
  return rooms.find((room) => room.id === id);
}

export function featuredRooms() {
  return rooms.filter((room) => room.featured);
}
