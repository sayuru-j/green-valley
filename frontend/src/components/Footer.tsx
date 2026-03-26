import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import logoImg from "@/assets/log.png";

const Footer = () => (
  <footer className="forest-gradient text-primary-foreground">
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
            <img src={logoImg} alt="Green Valley Logo" className="h-10 w-auto rounded-full object-cover shadow-sm" /> Green Valley <span className="text-gold">Resort</span>
          </h3>
          <p className="text-primary-foreground/70 font-body leading-relaxed">
            Where Sri Lankan nature meets world-class luxury. An eco-paradise nestled
            in the heart of Kurunegala.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-gold mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["Rooms", "Booking", "Restaurant", "Banquet", "Reviews", "Contact"].map(
              (l) => (
                <Link
                  key={l}
                  to={`/${l.toLowerCase()}`}
                  className="text-primary-foreground/70 hover:text-gold transition-colors text-sm tracking-wide"
                >
                  {l}
                </Link>
              )
            )}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-gold mb-4">Contact Us</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-gold" /> Puththalama Road, Udadigana, Kurunegala, Sri Lanka
            </span>
            <span className="flex items-center gap-2">
              <Phone size={16} className="text-gold" /> 0372 221 996
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} className="text-gold" /> greenvalleyresortk@gmail.com
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/50 text-sm">
        © 2026 Green Valley Resort. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
