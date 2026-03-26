import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import presidentialImg from "@/assets/presidential-suite.jpg";
import restaurantImg from "@/assets/restaurant.jpg";
import banquetImg from "@/assets/banquet-hall.jpg";
import gardenImg from "@/assets/garden-pathway.jpg";
import heroVideo from "@/assets/greenvalleybanner.mp4";
import roomImg from "@/assets/romm11.png";
import storyImg from "@/assets/story.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 hero-overlay" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <span className="text-gold uppercase tracking-[0.4em] text-sm font-body">
            Sri Lanka's Finest Eco-Luxury
          </span>

          <h1 className="text-4xl md:text-7xl font-serif font-bold text-primary-foreground mt-4 leading-tight">
            Where Sri Lankan Nature Meets{" "}
            <span className="text-gold-gradient">
              World-Class Luxury
            </span>
          </h1>

          <p className="text-primary-foreground/80 mt-6 text-lg font-body max-w-2xl mx-auto">
            Discover an exclusive eco-paradise of private villas, infinity pools,
            and authentic Sri Lankan hospitality in the heart of Kurunegala.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/booking" className="btn-primary px-10 py-4">
              Book Now
            </Link>

            <Link
              to="/rooms"
              className="border border-primary-foreground/30 px-10 py-4 rounded-lg font-semibold tracking-wider uppercase text-primary-foreground text-sm hover:bg-primary-foreground/10 transition-all"
            >
              Explore Rooms
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-24 section-beige">
        <div className="container mx-auto px-6">
          <SectionHeading title="Our Story" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={storyImg}
                alt=""
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                Over 10 years of Excellence. Professional stewards and supervisors
                taking care of your function. The proprietor is available for all
                your inquiries unlike most other venues. No Hall charge, No Service
                Charge, No added tax, No electricity charges, No charges for liquor usage.
              </p>

              <section className="py-12">
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="bg-gray-50 px-12 py-8 rounded-2xl shadow-md text-center min-w-[220px] hover:shadow-xl transition-all duration-300">
                    <h3 className="text-3xl font-serif font-bold text-forest mb-2">
                      100+
                    </h3>
                    <p className="text-sm text-muted-foreground tracking-wide">
                      5-Star Reviews
                    </p>
                  </div>

                  <div className="bg-gray-50 px-12 py-8 rounded-2xl shadow-md text-center min-w-[220px] hover:shadow-xl transition-all duration-300">
                    <h3 className="text-3xl font-serif font-bold text-forest mb-2">
                      10
                    </h3>
                    <p className="text-sm text-muted-foreground tracking-wide">
                      Years of Excellence
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Restaurant */}
      <section className="py-24 section-cream">
        <div className="container mx-auto px-6">
          <SectionHeading
            subtitle="Fine Dining"
            title="Authentic Cuisine"
            description="Savour the rich flavours of Sri Lanka in our award-winning restaurant."
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl relative h-[400px]"
          >
            <img
              src={restaurantImg}
              alt="Fine dining restaurant"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 hero-overlay flex items-end justify-center pb-10">
              <Link to="/restaurant" className="btn-primary">
                View Full Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Banquet */}
      <section className="py-24 section-beige">
        <div className="container mx-auto px-6">
          <SectionHeading
            subtitle="Events & Weddings"
            title="The Grand Banquet Hall"
            description="Celebrate life's most precious moments in our opulent banquet hall."
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl relative h-[400px]"
          >
            <img
              src={banquetImg}
              alt="Grand banquet hall"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 hero-overlay flex items-end justify-center pb-10">
              <Link to="/banquet" className="btn-primary">
                Explore Banquet
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-24 section-beige">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="OUR ROOMS"
            description="Designed with clean interiors and soothing tones."
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl relative h-[400px]"
          >
            <img
              src={roomImg}
              alt="Our rooms"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 hero-overlay flex items-end justify-center pb-10">
              <Link to="/rooms" className="btn-primary">
                Explore Rooms
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;