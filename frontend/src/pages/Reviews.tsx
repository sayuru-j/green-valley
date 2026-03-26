import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { API_BASE } from "@/lib/auth";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface GuestReview {
  id: number;
  guest_name: string;
  location: string | null;
  rating: number;
  body: string;
  created_at: string;
}

const dateLabel = (iso: string) => {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(d);
  } catch {
    return iso;
  }
};

const Reviews = () => {
  const [reviews, setReviews] = useState<GuestReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    guest_name: "",
    location: "",
    rating: "5",
    body: "",
  });

  const loadReviews = () => {
    fetch(`${API_BASE}/api/reviews`)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setReviews(data as GuestReview[]);
        } else {
          setReviews([]);
        }
      })
      .catch(() => {
        toast.error("Could not load reviews.");
        setReviews([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const guest_name = form.guest_name.trim();
    const body = form.body.trim();
    if (!guest_name || !body) {
      toast.error("Please enter your name and review.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name,
          body,
          location: form.location.trim() || undefined,
          rating: Number(form.rating),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Submission failed.");
        return;
      }
      toast.success(
        data.message ||
          "Thank you — your review will appear after it's approved."
      );
      setForm({ guest_name: "", location: "", rating: "5", body: "" });
    } catch {
      toast.error("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <section className="py-20 section-beige">
        <div className="container mx-auto px-6">
          <SectionHeading
            subtitle="Guest Experiences"
            title="What Our Guests Say"
            description="The words of our cherished guests speak louder than any description we could offer."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto mb-16 bg-card rounded-2xl p-8 shadow-md border border-border"
          >
            <h3 className="text-xl font-serif font-bold text-foreground mb-2 text-center">
              Share your experience
            </h3>
            <p className="text-sm text-muted-foreground font-body text-center mb-6">
              Your review is shared with our team first; approved reviews appear here for other guests.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Your name</label>
                <input
                  required
                  value={form.guest_name}
                  onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Jane Smith"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Location <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Colombo, Sri Lanka"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Rating</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Your review</label>
                <textarea
                  required
                  rows={4}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y min-h-[100px]"
                  placeholder="Tell us about your stay…"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Submit review"}
              </button>
            </form>
          </motion.div>

          {loading ? (
            <p className="text-center text-muted-foreground font-body">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground font-body max-w-md mx-auto">
              No published reviews yet. Be the first to share your story using the form above.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-md border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={18} className="fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground font-body leading-relaxed mb-6 italic">
                    &ldquo;{review.body}&rdquo;
                  </p>
                  <div>
                    <p className="font-serif font-semibold text-foreground">
                      {review.guest_name}
                    </p>
                    {review.location ? (
                      <p className="text-sm text-muted-foreground font-body">{review.location}</p>
                    ) : null}
                    <p className="text-xs text-gold mt-1">{dateLabel(review.created_at)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reviews;
