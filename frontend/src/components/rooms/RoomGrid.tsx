import { useState } from "react";
import { RoomCard } from "./RoomCard";
import { RoomModal } from "./RoomModal";
import type { Room } from "../../types";

export function RoomGrid({ rooms }: { rooms: Room[] }) {
  const [selected, setSelected] = useState<Room | null>(null);
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onDetails={setSelected} />
        ))}
      </div>
      {selected && <RoomModal room={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
