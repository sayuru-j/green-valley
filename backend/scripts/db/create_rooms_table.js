const db = require("../../database");

const dropTableQuery = `DROP TABLE IF EXISTS rooms;`;

const createTableQuery = `
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL
);
`;

const seedQuery1 = `INSERT INTO rooms (name, description, price) VALUES ('Lagoon Crown Suite', 'An exclusive luxury suite located in a serene and elevated area of the resort, offering breathtaking views of the tranquil lagoon and surrounding greenery. Designed for ultimate comfort and privacy, this suite features elegant interiors, premium furnishings, and a spacious layout. Guests can enjoy a peaceful atmosphere, soundproofed comfort, and a private bathroom, making it ideal for a relaxing and unforgettable stay.', 30000);`;

db.query(dropTableQuery, (err) => {
  if (err) {
    console.error("Failed to drop table:", err);
    db.end(() => process.exit(1));
    return;
  }

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Failed to create table:", err);
      db.end(() => process.exit(1));
      return;
    }

    db.query(seedQuery1, () => {
      console.log("Rooms Table Re-created securely.");
      db.end(() => process.exit(0));
    });
  });
});
