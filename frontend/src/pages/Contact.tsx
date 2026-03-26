import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import gardenImg from "@/assets/garden-pathway.jpg";
import { API_BASE } from "@/lib/auth";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // 🔥 CONNECTED TO BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send message");
        return;
      }

      toast.success("Message sent! We'll get back to you soon.");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen pt-24">

      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <img src={gardenImg} alt="Resort garden" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center">
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-body">Get In Touch</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground mt-2">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 section-beige">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">

            {/* LEFT SIDE */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionHeading subtitle="Reach Us" title="We'd Love to Hear From You" />

              <div className="space-y-6 mb-8">

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <MapPin className="text-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">Address</h4>
                    <p className="text-muted-foreground text-sm">
                      Puththalama Road, Udadigana, Kurunegala, Sri Lanka
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Phone className="text-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">Phone</h4>
                    <p className="text-muted-foreground text-sm">0372 221 996</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Mail className="text-gold" size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-foreground">Email</h4>
                    <p className="text-muted-foreground text-sm">
                      greenvalleyresortk@gmail.com
                    </p>
                  </div>
                </div>

              </div>

              {/* MAP */}
              <div className="rounded-2xl overflow-hidden shadow-xl h-[250px]">
                <iframe
                  title="Green Valley Resort Location"
                  src="https://maps.google.com/maps?q=Green+Valley+Resort,+G84R%2BVCQ,+Kurunegala,+Sri+Lanka&hl=en&z=15&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* FORM */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-xl border border-border space-y-5">

                <h3 className="font-serif font-bold text-2xl text-foreground">
                  Send a Message
                </h3>

                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground"
                />

                <input
                  required
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground"
                />

                <input
                  required
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground"
                />

                <textarea
                  required
                  rows={4}
                  placeholder="Your message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground resize-none"
                />

                <button
                  type="submit"
                  className="btn-primary w-full py-4 rounded-lg font-semibold tracking-wider uppercase text-sm"
                >
                  Send Message
                </button>

              </form>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;