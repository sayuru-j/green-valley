import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/log.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/booking", label: "Booking" },
  { to: "/restaurant", label: "Restaurant" },
  { to: "/banquet", label: "Banquet" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="Green Valley Logo" className="h-10 w-auto rounded-full object-cover shadow-sm" />
          <span className="text-xl font-serif font-bold tracking-wide text-primary-foreground">
            Green Valley <span className="text-gold">Resort</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-widest uppercase font-body transition-colors duration-300 ${location.pathname === link.to
                  ? "text-gold"
                  : "text-primary-foreground/80 hover:text-gold"
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* GREEN BUTTON */}
          <Link
            to="/booking"
            className="btn-primary px-6 py-2.5 text-sm"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-primary-foreground"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-dark border-t border-gold/20"
          >
            <div className="flex flex-col items-center gap-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm tracking-widest uppercase ${location.pathname === link.to
                      ? "text-gold"
                      : "text-primary-foreground/80"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* GREEN MOBILE BUTTON */}
              <Link
                to="/booking"
                onClick={() => setOpen(false)}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;