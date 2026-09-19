export type RoomAvailability =
  | "available"
  | "limited"
  | "unavailable"
  | "fullyBooked"
  | "maintenance"
  | "cleaning";

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  capacity: number;
  beds: string;
  sizeSqFt: number;
  facilities: string[];
  pricePerNight: number;
  availability: RoomAvailability;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export interface HotelService {
  id: string;
  name: string;
  description: string;
  icon: "wifi" | "zap" | "battery" | "droplets" | "flame" | "bell";
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  stayMonth: string;
  isDemo?: boolean;
  status?: "pending" | "approved" | "rejected";
}

export interface BookingRecord {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequest?: string;
  roomType: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  numberOfRooms: number;
  nights: number;
  pricePerNight: number;
  totalAmount: number;
  paymentMethod: string;
  bookingStatus: "pending" | "confirmed" | "cancelled" | "checked-in" | "checked-out";
  createdAt: string;
}

export interface BookingDraft {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  roomId: string;
}

export interface BookingRequest extends BookingDraft {
  name: string;
  email: string;
  phone: string;
  specialRequest: string;
  nights: number;
  pricePerNight: number;
  total: number;
  availability: RoomAvailability;
  submittedAt: string;
}

export interface HotelInfo {
  name: string;
  shortName: string;
  tagline: string;
  website: string;
  location: string;
  city: string;
  region: string;
  country: string;
  intro: string;
  about: string[];
  whyChoose: { title: string; text: string }[];
  contact: {
    phone: string;
    phoneNote: string;
    email: string;
    emailNote: string;
    address: string;
    addressNote: string;
    mapQuery: string;
  };
  social: { label: string; href: string }[];
}
