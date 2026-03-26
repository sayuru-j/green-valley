const bcrypt = require("bcryptjs");
const config = require("../config");

/** Stable placeholder images (HTTPS links only). */
const IMG_ROOM_1 = "https://picsum.photos/seed/gvd-room1/800/600";
const IMG_ROOM_2 = "https://picsum.photos/seed/gvd-room2/800/600";
const IMG_ROOM_3 = "https://picsum.photos/seed/gvd-room3/800/600";
const IMG_MENU_1 = "https://picsum.photos/seed/gvd-menu1/400/400";
const IMG_MENU_2 = "https://picsum.photos/seed/gvd-menu2/400/400";
const IMG_MENU_3 = "https://picsum.photos/seed/gvd-menu3/400/400";
const IMG_BANQUET_1 = "https://picsum.photos/seed/gvd-banquet1/800/500";
const IMG_BANQUET_2 = "https://picsum.photos/seed/gvd-banquet2/800/500";

const SAMPLE_ROOMS = [
  {
    name: "Lagoon Crown Suite",
    description:
      "An exclusive luxury suite located in a serene and elevated area of the resort, offering breathtaking views of the tranquil lagoon and surrounding greenery. Designed for ultimate comfort and privacy, this suite features elegant interiors, premium furnishings, and a spacious layout.",
    price: 30000,
    subtitle: "Lagoon views & private terrace",
    image_url: IMG_ROOM_1,
    max_occupancy: 3,
    display_order: 0,
  },
  {
    name: "Green Haven Family Suite",
    description:
      "A spacious and welcoming suite designed especially for families or small groups seeking comfort and togetherness. The room features multiple bedding arrangements and a generous living space along with modern amenities and private bathroom facilities.",
    price: 20000,
    subtitle: "Ideal for families",
    image_url: IMG_ROOM_2,
    max_occupancy: 5,
    display_order: 1,
  },
  {
    name: "Standard Deluxe",
    description:
      "A comfortable and stylish room designed for guests who appreciate simplicity with quality. Includes a cozy bed arrangement, modern furnishings, and a private bathroom for a relaxing stay.",
    price: 15000,
    subtitle: "Comfortable & bright",
    image_url: IMG_ROOM_3,
    max_occupancy: 2,
    display_order: 2,
  },
];

/** Same copy as former frontend mock; approved for public listing in dev. */
const SAMPLE_GUEST_REVIEWS = [
  {
    guest_name: "Amara & Ravi Perera",
    location: "Colombo, Sri Lanka",
    rating: 5,
    body:
      "Our honeymoon at the Presidential Suite was absolutely magical. The private cinema, the jacuzzi with valley views — it felt like a dream. The staff treated us like royalty.",
    monthsAgo: 0,
  },
  {
    guest_name: "James & Sophie Whitfield",
    location: "London, United Kingdom",
    rating: 5,
    body:
      "We've stayed at luxury resorts around the world, but Green Valley stands out. The Sri Lankan cuisine was extraordinary, and the garden pathways at night are breathtaking.",
    monthsAgo: 1,
  },
  {
    guest_name: "Kumara Dissanayake",
    location: "Kandy, Sri Lanka",
    rating: 5,
    body:
      "Hosted my daughter's wedding here. The banquet hall was stunning — crystal chandeliers, impeccable service, and the food was outstanding. Every guest was impressed.",
    monthsAgo: 2,
  },
  {
    guest_name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    rating: 5,
    body:
      "The Valley View Suite was perfection. Waking up to those misty green valleys with the outdoor tub was an experience I'll never forget. Pure tranquillity.",
    monthsAgo: 3,
  },
  {
    guest_name: "Priya & Dinesh Mendis",
    location: "Galle, Sri Lanka",
    rating: 5,
    body:
      "The Garden Villa was our personal paradise. The plunge pool surrounded by tropical flowers, the breakfast delivered to our terrace — absolute bliss!",
    monthsAgo: 4,
  },
  {
    guest_name: "Elena Rossi",
    location: "Milan, Italy",
    rating: 5,
    body:
      "As a travel blogger, I've seen many beautiful properties. Green Valley is exceptional — the design, the food, the people. This is Sri Lanka at its finest.",
    monthsAgo: 5,
  },
];

const SAMPLE_MENU = [
  {
    name: "Sri Lankan Rice & Curry",
    description:
      "Traditional rice served with an array of curries, sambols, and papadams",
    price: 3500,
    category: "🍛 Main Dishes",
    image_url: IMG_MENU_1,
    dietary_note: "Vegetarian options available",
    is_featured: 1,
    display_order: 0,
  },
  {
    name: "Prawn Curry with Coconut Sambol",
    description: "Jumbo prawns in coconut cream with freshly ground sambol",
    price: 4200,
    category: "🥘 Signature Specials",
    image_url: IMG_MENU_2,
    dietary_note: "Spicy",
    is_featured: 0,
    display_order: 1,
  },
  {
    name: "King Coconut",
    description: "Fresh king coconut water served chilled",
    price: 800,
    category: "🥥 Beverages",
    image_url: IMG_MENU_3,
    dietary_note: null,
    is_featured: 0,
    display_order: 2,
  },
];

/**
 * Dev-only: default admin (admin/admin) if missing, plus sample rows when
 * rooms / menu / banquet_packages are empty. No-op in production.
 */
async function seedDevDataIfNeeded(pool) {
  if (config.isProduction) {
    return;
  }

  const q = pool.promise();

  try {
    const [adminRows] = await q.query(
      "SELECT id FROM admins WHERE username = ?",
      ["admin"]
    );
    if (adminRows.length === 0) {
      const hash = bcrypt.hashSync("admin", 10);
      await q.query("INSERT INTO admins (username, password) VALUES (?, ?)", [
        "admin",
        hash,
      ]);
      console.log(
        "[dev] Default admin user created (username: admin, password: admin)"
      );
    }

    const [roomCountRows] = await q.query(
      "SELECT COUNT(*) AS c FROM rooms"
    );
    if (Number(roomCountRows[0].c) === 0) {
      for (const row of SAMPLE_ROOMS) {
        await q.query(
          `INSERT INTO rooms (name, description, price, subtitle, image_url, max_occupancy, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            row.name,
            row.description,
            row.price,
            row.subtitle,
            row.image_url,
            row.max_occupancy,
            row.display_order,
          ]
        );
      }
      console.log("[dev] Seeded sample rooms");
    }

    const [menuCountRows] = await q.query(
      "SELECT COUNT(*) AS c FROM menu_items"
    );
    if (Number(menuCountRows[0].c) === 0) {
      for (const row of SAMPLE_MENU) {
        await q.query(
          `INSERT INTO menu_items (name, description, price, category, image_url, dietary_note, is_featured, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            row.name,
            row.description,
            row.price,
            row.category,
            row.image_url,
            row.dietary_note,
            row.is_featured,
            row.display_order,
          ]
        );
      }
      console.log("[dev] Seeded sample menu items");
    }

    await q.query(
      `
      INSERT INTO banquet_packages (name, description, price, image_url, max_guests, highlights, display_order)
      SELECT 'Wedding Package',
        'A fairytale wedding in our crystal-adorned hall with complete event coordination, floral arrangements, and bespoke catering.',
        1200000,
        ?,
        250,
        'Crystal chandeliers\nDedicated event coordinator\nCustom catering menus',
        0
      WHERE NOT EXISTS (SELECT 1 FROM banquet_packages WHERE name = 'Wedding Package')
    `,
      [IMG_BANQUET_1]
    );
    await q.query(
      `
      INSERT INTO banquet_packages (name, description, price, image_url, max_guests, highlights, display_order)
      SELECT 'Corporate Event Package',
        'Professional conferencing with state-of-the-art AV, dedicated event manager, and premium dining.',
        850000,
        ?,
        180,
        'AV equipment included\nBreakout spaces\nPremium coffee breaks',
        1
      WHERE NOT EXISTS (SELECT 1 FROM banquet_packages WHERE name = 'Corporate Event Package')
    `,
      [IMG_BANQUET_2]
    );

    const [reviewCountRows] = await q.query(
      "SELECT COUNT(*) AS c FROM guest_reviews"
    );
    if (Number(reviewCountRows[0].c) === 0) {
      for (const row of SAMPLE_GUEST_REVIEWS) {
        await q.query(
          `INSERT INTO guest_reviews (guest_name, location, rating, body, is_approved, created_at)
           VALUES (?, ?, ?, ?, 1, DATE_SUB(NOW(), INTERVAL ? MONTH))`,
          [row.guest_name, row.location, row.rating, row.body, row.monthsAgo]
        );
      }
      console.log("[dev] Seeded sample guest reviews");
    }
  } catch (err) {
    console.warn("[dev] Could not seed development data:", err.message);
  }
}

module.exports = seedDevDataIfNeeded;
