const db = require("../../database");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS banquet_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL
);
`;

const seedQuery = `
INSERT INTO banquet_packages (name, description, price)
SELECT 'Wedding Package', 'A fairytale wedding in our crystal-adorned hall with complete event coordination, floral arrangements, and bespoke catering.', 1200000
WHERE NOT EXISTS (SELECT 1 FROM banquet_packages WHERE name = 'Wedding Package');
`;

const seedQuery2 = `
INSERT INTO banquet_packages (name, description, price)
SELECT 'Corporate Event Package', 'Professional conferencing with state-of-the-art AV, dedicated event manager, and premium dining.', 850000
WHERE NOT EXISTS (SELECT 1 FROM banquet_packages WHERE name = 'Corporate Event Package');
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("Failed to create table:", err);
    db.end(() => process.exit(1));
    return;
  }

  db.query(seedQuery, (err) => {
    if (err) console.error(err);
    db.query(seedQuery2, (err) => {
      if (err) console.error(err);
      console.log("Banquet Packages Table created and seeded.");
      db.end(() => process.exit(0));
    });
  });
});
