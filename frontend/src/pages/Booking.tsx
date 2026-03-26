import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import booking from "@/assets/booking.jpeg";
import { toast } from "sonner";
import { API_BASE } from "@/lib/auth";

interface RoomRow {
  id: number;
  name: string;
  price: number;
}

const Booking = () => {
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [roomsReady, setRoomsReady] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    checkin: "",
    checkout: "",
    guests: "2",
    suite: "",
  });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/rooms`)
      .then((res) => res.json())
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return;
        const list = data as RoomRow[];
        setRooms(list);
        setForm((f) => ({
          ...f,
          suite: f.suite === "" && list[0] ? list[0].name : f.suite,
        }));
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Could not load rooms. Try again later.");
        }
      })
      .finally(() => {
        if (!cancelled) setRoomsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ DATE VALIDATION
    const checkinDate = new Date(form.checkin);
    const checkoutDate = new Date(form.checkout);

    if (checkoutDate <= checkinDate) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (!form.suite.trim()) {
      toast.error("Please select a suite");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          contact: form.contact,
          room: form.suite,
          checkin: form.checkin,
          checkout: form.checkout,
          people: Number(form.guests)
        })
      });

      const data = await res.json();

      // ❌ ROOM ALREADY BOOKED
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      // ✅ SUCCESS
      toast.success(data.message);

      // reset form
      setForm({
        name: "",
        email: "",
        contact: "",
        checkin: "",
        checkout: "",
        guests: "2",
        suite: rooms[0]?.name ?? "",
      });

    } catch (error) {
      console.error(error);
      toast.error("Booking failed");
    }
  };

  return (
    <div className="relative min-h-screen">

      {/* Background */}
      <img
        src={booking}
        alt="Booking Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay z-0" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-2xl w-full">

          {/* Heading */}
          <div className="glass rounded-xl text-center p-8 mb-12">
            <SectionHeading subtitle="Reservation" title="Book Your Stay" light />
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 md:p-10 space-y-6"
          >

            {/* Name */}
            <input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40"
            />

            {/* Email */}
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40"
            />

            {/* Contact */}
            <input
              required
              placeholder="Contact Number"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40"
            />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="date"
                value={form.checkin}
                onChange={(e) => setForm({ ...form, checkin: e.target.value })}
                className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-white"
              />

              <input
                required
                type="date"
                value={form.checkout}
                onChange={(e) => setForm({ ...form, checkout: e.target.value })}
                className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-white"
              />
            </div>

            {/* Guests & Suite */}
            <div className="grid grid-cols-2 gap-4">

              {/* Guests */}
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-white"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n} className="text-black bg-white">
                    {n} Guests
                  </option>
                ))}
              </select>

              {/* Suite — options from /api/rooms */}
              <select
                required
                value={form.suite}
                onChange={(e) => setForm({ ...form, suite: e.target.value })}
                className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-white"
              >
                {rooms.length === 0 ? (
                  <option value="" className="text-black bg-white">
                    {!roomsReady ? "Loading suites…" : "No suites available — check back soon"}
                  </option>
                ) : (
                  rooms.map((room) => (
                    <option key={room.id} value={room.name} className="text-black bg-white">
                      {room.name} – LKR {Number(room.price).toLocaleString()}/night
                    </option>
                  ))
                )}
              </select>

            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn-primary w-full py-4 rounded-lg font-semibold tracking-wider uppercase text-sm mt-4"
            >
              Confirm Reservation
            </button>

          </motion.form>

        </div>
      </div>
    </div>
  );
};

export default Booking;