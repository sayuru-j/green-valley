import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { API_BASE } from "@/lib/auth";
import presidentialImg from "@/assets/presidential-suite.jpg";
import valleyImg from "@/assets/valley-suite.jpg";
import gardenVillaImg from "@/assets/garden-villa.jpg";
import cinemaImg from "@/assets/cinema-room.jpg";
import room1 from "@/assets/11.png";
import room2 from "@/assets/22.png";
import room3 from "@/assets/5.jpeg";

const fallbackImages = [room3, room2, room1, presidentialImg, valleyImg, gardenVillaImg, cinemaImg];

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  subtitle?: string | null;
  image_url?: string | null;
  max_occupancy?: number | null;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/rooms`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setRooms(data);
        }
      })
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  return (
  <div className="min-h-screen pt-24">
    <section className="py-16 section-beige">
      <div className="container mx-auto px-6">
        <SectionHeading
          subtitle="Accommodation"
          title="Our Luxury Suites"
          description="Each suite is a masterpiece of design, blending contemporary luxury with the untouched beauty of Sri Lanka's tropical landscape."
        />

        <div className="space-y-20">
          {rooms.map((room, i) => {
            const imgSrc =
              room.image_url && String(room.image_url).trim() !== ""
                ? room.image_url.trim()
                : fallbackImages[i % fallbackImages.length];
            return (
              <motion.div
                key={room.id || room.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid md:grid-cols-2 gap-10 items-center ${
                  i % 2 === 1 ? "md:direction-rtl" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`rounded-2xl overflow-hidden shadow-2xl ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={room.name}
                    className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content */}
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <h3 className="text-3xl font-serif font-bold text-foreground mt-2 mb-3">
                    {room.name}
                  </h3>
                  {room.subtitle && String(room.subtitle).trim() !== "" ? (
                    <p className="text-muted-foreground font-body text-sm mb-3 -mt-1">
                      {room.subtitle}
                    </p>
                  ) : null}

                  <p className="text-muted-foreground font-body leading-relaxed mb-6">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-secondary px-3 py-1.5 rounded-full text-xs text-forest font-medium tracking-wide">
                      Luxury Suite
                    </span>
                    <span className="bg-secondary px-3 py-1.5 rounded-full text-xs text-forest font-medium tracking-wide">
                      Private Bathroom
                    </span>
                    {room.max_occupancy != null && Number(room.max_occupancy) > 0 ? (
                      <span className="bg-secondary px-3 py-1.5 rounded-full text-xs text-forest font-medium tracking-wide">
                        Up to {Number(room.max_occupancy)} guests
                      </span>
                    ) : null}
                  </div>

                  <p className="text-2xl font-serif font-bold text-gold-dark">
                    LKR {Number(room.price).toLocaleString()}{" "}
                    <span className="text-sm text-muted-foreground font-body font-normal">
                      / per night
                    </span>
                  </p>

                  <Link
                    to="/booking"
                    className="btn-primary inline-block mt-6 px-8 py-3 text-sm shadow-lg hover:scale-105"
                  >
                    Book This Suite
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  </div>
  );
};

export default Rooms;
