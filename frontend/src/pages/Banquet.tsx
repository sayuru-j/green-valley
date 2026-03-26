import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { API_BASE } from "@/lib/auth";
import banquetImg from "@/assets/banquet-hall.jpg";
import gardenImg from "@/assets/garden-pathway.jpg";
import restaurantImg from "@/assets/restaurant.jpg";

interface BanquetPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string | null;
  max_guests?: number | null;
  highlights?: string | null;
}

const Banquet = () => {
  const [activeImg, setActiveImg] = useState(0);
  const [banquetPackages, setBanquetPackages] = useState<BanquetPackage[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/banquet-packages`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setBanquetPackages(data);
        }
      })
      .catch((err) => console.error("Error fetching banquet packages:", err));
  }, []);

  const heroSrc = useMemo(() => {
    const fromApi = banquetPackages.find(
      (p) => p.image_url && String(p.image_url).trim() !== ""
    )?.image_url;
    return fromApi && String(fromApi).trim() !== "" ? String(fromApi).trim() : banquetImg;
  }, [banquetPackages]);

  const dynamicGalleryImages = useMemo(() => {
    const urls = banquetPackages
      .map((p) => p.image_url)
      .filter((u): u is string => !!u && String(u).trim() !== "")
      .map((u) => u.trim());
    if (urls.length > 0) {
      return [...new Set(urls)];
    }
    return [banquetImg, gardenImg, restaurantImg];
  }, [banquetPackages]);

  useEffect(() => {
    setActiveImg((i) => (i >= dynamicGalleryImages.length ? 0 : i));
  }, [dynamicGalleryImages.length]);

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <img
          src={heroSrc}
          alt="Grand banquet hall"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = banquetImg;
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center">
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-body">
            Events & Celebrations
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground mt-2">
            The Grand Banquet Hall
          </h1>
        </div>
      </section>

      <section className="py-20 section-beige">
        <div className="container mx-auto px-6">
          <SectionHeading
            subtitle="Weddings & Events"
            title="Celebrate in Grandeur"
            description="Our opulent banquet hall features crystal chandeliers, gold & ivory décor, and seating for up to 250 guests."
          />

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {banquetPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-card rounded-xl overflow-hidden shadow-md border border-border">
                    {pkg.image_url && String(pkg.image_url).trim() !== "" ? (
                      <div className="w-full h-40 overflow-hidden">
                        <img
                          src={pkg.image_url.trim()}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : null}
                    <div className="p-6">
                      <h3 className="font-serif font-bold text-xl text-foreground mb-2">
                        ⭐ {pkg.name}
                      </h3>
                      <p className="text-muted-foreground font-body text-sm mb-3">
                        {pkg.description}
                      </p>
                      {pkg.max_guests != null && Number(pkg.max_guests) > 0 ? (
                        <p className="text-sm font-medium text-forest mb-2">
                          Up to {Number(pkg.max_guests)} guests
                        </p>
                      ) : null}
                      {pkg.highlights && String(pkg.highlights).trim() !== "" ? (
                        <p className="text-muted-foreground font-body text-sm whitespace-pre-line mb-3">
                          {pkg.highlights.trim()}
                        </p>
                      ) : null}
                      <p className="text-2xl font-serif font-bold text-gold-dark">
                        Starting at LKR {Number(pkg.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                <Link
                  to="/contact"
                  className="inline-block bg-[#1f4d3a] hover:bg-[#163b2c] text-white px-8 py-3 rounded-lg text-sm font-semibold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Book Your Event
                </Link>
              </div>
            </motion.div>

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl mb-4">
                <img
                  src={dynamicGalleryImages[activeImg] ?? banquetImg}
                  alt="Banquet gallery"
                  className="w-full h-[400px] object-cover transition-all duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = banquetImg;
                  }}
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                {dynamicGalleryImages.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImg
                        ? "border-gold"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-24 h-16 object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = banquetImg;
                      }}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banquet;
