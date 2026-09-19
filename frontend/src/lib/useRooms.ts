import { useEffect, useState } from "react";
import { api } from "./api";
import { rooms as fallbackRooms } from "../data/rooms";
import type { Room } from "../types";

export function useRooms(query?: { checkIn?: string; checkOut?: string; guests?: number }) {
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query?.checkIn) params.set("checkIn", query.checkIn);
    if (query?.checkOut) params.set("checkOut", query.checkOut);
    if (query?.guests) params.set("guests", String(query.guests));
    const path =
      query?.checkIn && query?.checkOut
        ? `/api/rooms/availability?${params}`
        : `/api/rooms${params.toString() ? `?${params}` : ""}`;

    let cancelled = false;
    setLoading(true);
    api<{ rooms: Room[] }>(path)
      .then((data) => {
        if (!cancelled && data.rooms?.length) setRooms(data.rooms);
        setError(null);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query?.checkIn, query?.checkOut, query?.guests]);

  return { rooms, loading, error };
}
