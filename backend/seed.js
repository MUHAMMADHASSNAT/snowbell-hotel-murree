import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { Room } from "./models/Room.js";
import { Review } from "./models/Review.js";

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const ROOM_TYPES = [
  {
    roomType: "standard-twin",
    slug: "standard-twin",
    title: "Standard Twin",
    description: "Two single beds in a compact room for friends or colleagues travelling together.",
    longDescription:
      "A practical twin room for two guests. Furnishings are simple: writing space, wardrobe, and an ensuite bathroom with hot and cold water. Suited to short Murree stays when you need a clean, heated room rather than extra living space.",
    capacity: 2,
    beds: "2 single beds",
    sizeSqFt: 220,
    amenities: ["Heating", "Hot & cold water", "WiFi", "TV", "Ensuite bathroom"],
    price: 8500,
    images: [img("photo-1631049307264-da0ec9d70304")],
    imageAlt: "Twin hotel room with two single beds and warm lighting",
    featured: true,
    numbers: ["101", "102"],
  },
  {
    roomType: "deluxe-double",
    slug: "deluxe-double",
    title: "Deluxe Double",
    description: "One double bed, extra floor space, and a quieter layout for couples.",
    longDescription:
      "The deluxe double is the usual choice for two adults. A larger room than the twin, with a double bed, seating, and the same core utilities: heating, backup power on the property, and ensuite facilities.",
    capacity: 2,
    beds: "1 double bed",
    sizeSqFt: 280,
    amenities: ["Heating", "Hot & cold water", "WiFi", "TV", "Seating area", "Ensuite bathroom"],
    price: 12000,
    images: [img("photo-1611892440504-42a792e24d32")],
    imageAlt: "Deluxe hotel room with a double bed and mountain-style interior",
    featured: true,
    numbers: ["201", "202"],
  },
  {
    roomType: "mountain-view",
    slug: "mountain-view",
    title: "Mountain View Double",
    description: "Double room placed for a better outlook over the surrounding hills.",
    longDescription:
      "Same comfort as the deluxe double, positioned on a higher floor or outward-facing side of the building for a wider hill view. Availability changes with season and weather.",
    capacity: 2,
    beds: "1 double bed",
    sizeSqFt: 290,
    amenities: ["Hill view", "Heating", "Hot & cold water", "WiFi", "TV", "Ensuite bathroom"],
    price: 15000,
    images: [img("photo-1566073771259-6a8506099945")],
    imageAlt: "Hotel room window looking toward pine-covered hills",
    featured: true,
    numbers: ["301", "302"],
  },
  {
    roomType: "family-suite",
    slug: "family-suite",
    title: "Family Suite",
    description: "Separate sleeping space for a small family, with room for children to settle in.",
    longDescription:
      "A larger unit for up to four guests. Useful for parents travelling with children who need more than a single room. Includes heating, an ensuite bathroom, and space for luggage after a drive up from the plains.",
    capacity: 4,
    beds: "1 double bed and 2 single beds",
    sizeSqFt: 420,
    amenities: ["Heating", "Hot & cold water", "WiFi", "TV", "Family layout", "Ensuite bathroom"],
    price: 18500,
    images: [img("photo-1582719478250-c89cae4dc85b")],
    imageAlt: "Spacious family hotel suite with sitting area",
    featured: false,
    numbers: ["401", "402"],
  },
];

async function upsertStaff(email, name, password, role) {
  if (!email || !password) return;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return;
  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ name, email: email.toLowerCase(), passwordHash, role, active: true });
  console.log(`Seeded ${role}: ${email}`);
}

export async function seedIfNeeded() {
  await upsertStaff(
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_NAME || "Hotel Admin",
    process.env.ADMIN_PASSWORD,
    "admin",
  );
  await upsertStaff(
    process.env.RECEPTIONIST_EMAIL,
    process.env.RECEPTIONIST_NAME || "Front Desk",
    process.env.RECEPTIONIST_PASSWORD,
    "receptionist",
  );

  if ((await Room.countDocuments()) === 0) {
    const docs = ROOM_TYPES.flatMap((type) =>
      type.numbers.map((roomNumber) => ({
        roomNumber,
        roomType: type.roomType,
        slug: type.slug,
        title: type.title,
        description: type.description,
        longDescription: type.longDescription,
        price: type.price,
        capacity: type.capacity,
        beds: type.beds,
        sizeSqFt: type.sizeSqFt,
        images: type.images,
        imageAlt: type.imageAlt,
        amenities: type.amenities,
        status: "available",
        featured: type.featured,
        active: true,
      })),
    );
    await Room.insertMany(docs);
    console.log(`Seeded ${docs.length} rooms`);
  }

  if ((await Review.countDocuments()) === 0) {
    await Review.insertMany([
      {
        name: "Ayesha K.",
        rating: 5,
        review:
          "Clean room, heating worked through a cold night, and the desk helped us time a Mall Road walk.",
        status: "approved",
      },
      {
        name: "Usman R.",
        rating: 4,
        review: "Straightforward stay after the drive from Islamabad. Backup power during a short outage.",
        status: "approved",
      },
      {
        name: "Hira S.",
        rating: 5,
        review: "Family suite had enough space for the children. Hot water in the morning was consistent.",
        status: "approved",
      },
      {
        name: "Bilal M.",
        rating: 4,
        review: "Quiet enough to sleep after a long day. WiFi was fine for messages.",
        status: "approved",
      },
    ]);
    console.log("Seeded sample reviews (editable in admin)");
  }
}
