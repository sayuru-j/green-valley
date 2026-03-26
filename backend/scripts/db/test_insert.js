const db = require("../../database");

const seedQuery2 = `INSERT INTO rooms (name, description, price) VALUES (?, ?, ?);`;
const seedData2 = [
  "Green Haven Family Suite",
  "A spacious and welcoming suite designed especially for families or small groups seeking comfort and togetherness. The room features multiple bedding arrangements and a generous living space that allows everyone to relax and enjoy their stay. Surrounded by calming natural views, the suite offers a warm and inviting atmosphere along with modern amenities, private bathroom facilities, and comfortable furnishings for a memorable family getaway.",
  20000,
];

const seedQuery3 = `INSERT INTO rooms (name, description, price) VALUES (?, ?, ?);`;
const seedData3 = [
  "Standard Deluxe",
  "A comfortable and stylish room designed for guests who appreciate simplicity with quality. The room includes a cozy bed arrangement, modern furnishings, and a private bathroom to ensure a relaxing stay. With a calm and welcoming ambiance, it is ideal for couples or individual travelers seeking a comfortable and affordable resort experience.",
  15000,
];

db.query(seedQuery2, seedData2, (err) => {
  if (err) console.error("Error inserting room 2:", err);
  else console.log("Room 2 inserted.");

  db.query(seedQuery3, seedData3, (err) => {
    if (err) console.error("Error inserting room 3:", err);
    else console.log("Room 3 inserted.");

    db.end(() => process.exit(0));
  });
});
