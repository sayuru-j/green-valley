import { motion } from "framer-motion";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  light?: boolean;
}

const SectionHeading = ({ subtitle, title, description, light }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-12"
  >
    {subtitle && (
      <span className="text-gold uppercase tracking-[0.3em] text-sm font-body font-semibold">
        {subtitle}
      </span>
    )}
    <h2 className={`text-3xl md:text-5xl font-serif font-bold mt-2 ${light ? "text-primary-foreground" : "text-foreground"}`}>
      {title}
    </h2>
    {description && (
      <p className={`mt-4 max-w-2xl mx-auto font-body leading-relaxed ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {description}
      </p>
    )}
    <div className="w-24 h-0.5 gold-gradient mx-auto mt-6 rounded-full" />
  </motion.div>
);

export default SectionHeading;
