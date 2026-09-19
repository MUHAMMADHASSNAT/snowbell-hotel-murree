import { hotel } from "../data/hotel";
import { Seo } from "../components/Seo";
import { PageHero } from "../components/layout/PageHero";
import { RoomGrid } from "../components/rooms/RoomGrid";
import { useRooms } from "../lib/useRooms";

export function RoomsPage() {
  const { rooms, loading } = useRooms();
  return (
    <>
      <Seo
        title={`Rooms | ${hotel.name}`}
        description="Standard twin, deluxe double, mountain view, and family suite rooms at Snowbell Hotel Murree."
      />
      <PageHero
        title="Rooms"
        subtitle="Four room types with published occupancy, beds, and nightly rates. Availability follows live bookings and room status."
        image="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80"
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        {loading && <p className="mb-4 text-sm text-muted">Updating availability…</p>}
        <RoomGrid rooms={rooms} />
      </section>
    </>
  );
}
