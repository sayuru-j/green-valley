const db = require("../../database");

const dropTableQuery = `DROP TABLE IF EXISTS menu_items;`;

const createTableQuery = `
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  category VARCHAR(255) NOT NULL
);
`;

const seed1 = `INSERT INTO menu_items (name, description, price, category) VALUES ('Sri Lankan Rice & Curry', 'Traditional rice served with an array of curries, sambols, and papadams', 3500, '🍛 Main Dishes');`;
const seed2 = `INSERT INTO menu_items (name, description, price, category) VALUES ('Prawn Curry with Coconut Sambol', 'Jumbo prawns in coconut cream with freshly ground sambol', 4200, '🥘 Signature Specials');`;
const seed3 = `INSERT INTO menu_items (name, description, price, category) VALUES ('King Coconut', 'Fresh king coconut water served chilled', 800, '🥥 Beverages');`;

db.query(dropTableQuery, (err) => {
  if (err) {
    console.error("Drop failed");
    db.end(() => process.exit(1));
    return;
  }

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Create failed");
      db.end(() => process.exit(1));
      return;
    }

    db.query(seed1, () => {
      db.query(seed2, () => {
        db.query(seed3, () => {
          console.log("Menu Items Table Re-created securely.");
          db.end(() => process.exit(0));
        });
      });
    });
  });
});
