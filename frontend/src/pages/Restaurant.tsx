import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { API_BASE } from "@/lib/auth";
import restaurantImg from "@/assets/restaurant.jpg";
import riceCurryImg from "@/assets/rice-curry.jpg";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string | null;
  dietary_note?: string | null;
  is_featured?: number | boolean;
}

function isFeatured(item: MenuItem) {
  return item.is_featured === true || Number(item.is_featured) === 1;
}

const Restaurant = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/menu`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMenuItems(data);
      })
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  const featuredItem = useMemo(() => menuItems.find(isFeatured), [menuItems]);

  const groupedMenu = useMemo(() => {
    const rest = featuredItem
      ? menuItems.filter((i) => i.id !== featuredItem.id)
      : menuItems;
    return rest.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [menuItems, featuredItem]);

  return (
    <div className="min-h-screen pt-24">
    {/* Hero */}
    <section className="relative h-[50vh] flex items-center justify-center">
      <img src={restaurantImg} alt="Fine dining restaurant" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative z-10 text-center">
        <span className="text-gold uppercase tracking-[0.3em] text-sm font-body">Sri Lankan Fine Dining 🇱🇰</span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground mt-2">
          Authentic Sri Lankan<br />Fine Dining Experience
        </h1>
      </div>
    </section>

    {/* Menu */}
    <section className="py-20 section-beige">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading subtitle="Our Menu" title="A Culinary Journey" description="Every dish tells a story of Sri Lanka's rich culinary heritage, prepared with locally sourced ingredients." />

        {featuredItem ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-xl mb-16 border border-border bg-card"
          >
            <div className="grid md:grid-cols-2 gap-0 md:gap-0 items-stretch">
              <div className="h-[220px] md:h-[300px] overflow-hidden">
                <img
                  src={
                    featuredItem.image_url && String(featuredItem.image_url).trim() !== ""
                      ? featuredItem.image_url.trim()
                      : riceCurryImg
                  }
                  alt={featuredItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <span className="text-gold-dark text-xs font-semibold uppercase tracking-wider mb-2">Chef&apos;s pick</span>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{featuredItem.name}</h3>
                <p className="text-muted-foreground font-body text-sm mb-4">{featuredItem.description}</p>
                {featuredItem.dietary_note && String(featuredItem.dietary_note).trim() !== "" ? (
                  <p className="text-xs text-forest font-medium mb-4">{featuredItem.dietary_note}</p>
                ) : null}
                <p className="text-xl font-serif font-bold text-gold-dark">
                  LKR {Number(featuredItem.price).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-xl mb-16 h-[300px]"
          >
            <img src={riceCurryImg} alt="Sri Lankan cuisine" className="w-full h-full object-cover" />
          </motion.div>
        )}

        {Object.entries(groupedMenu).map(([category, items], si) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.1 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-serif font-bold text-foreground mb-6">{category}</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-border"
                >
                  <div className="flex gap-4 justify-between items-start">
                    {item.image_url && String(item.image_url).trim() !== "" ? (
                      <img
                        src={item.image_url.trim()}
                        alt=""
                        className="w-20 h-20 shrink-0 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-semibold text-lg text-foreground">{item.name}</h4>
                      <p className="text-muted-foreground text-sm font-body mt-1">{item.description}</p>
                      {item.dietary_note && String(item.dietary_note).trim() !== "" ? (
                        <p className="text-xs text-forest font-medium mt-2">{item.dietary_note}</p>
                      ) : null}
                    </div>
                    <span className="font-serif font-bold text-gold-dark text-lg whitespace-nowrap ml-2">
                      LKR {Number(item.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default Restaurant;
