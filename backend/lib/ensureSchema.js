/**
 * Idempotent DDL: tables (IF NOT EXISTS) and stored procedures used by routes.
 * Runs on startup when config.autoSyncSchema is true.
 */
async function ensureSchema(pool) {
  const q = pool.promise();

  await q.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `);

  await q.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      contact VARCHAR(255) NOT NULL,
      room VARCHAR(255) NOT NULL,
      checkin DATE NOT NULL,
      checkout DATE NOT NULL,
      people INT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending'
    )
  `);

  await q.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price INT NOT NULL,
      subtitle VARCHAR(500) NULL,
      image_url VARCHAR(2048) NULL,
      max_occupancy INT UNSIGNED NULL,
      display_order INT NOT NULL DEFAULT 0
    )
  `);

  await q.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price INT NOT NULL,
      category VARCHAR(255) NOT NULL,
      image_url VARCHAR(2048) NULL,
      dietary_note VARCHAR(255) NULL,
      is_featured TINYINT(1) NOT NULL DEFAULT 0,
      display_order INT NOT NULL DEFAULT 0
    )
  `);

  await q.query(`
    CREATE TABLE IF NOT EXISTS banquet_packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price INT NOT NULL,
      image_url VARCHAR(2048) NULL,
      max_guests INT UNSIGNED NULL,
      highlights TEXT NULL,
      display_order INT NOT NULL DEFAULT 0
    )
  `);

  await q.query(`
    CREATE TABLE IF NOT EXISTS guest_reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guest_name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NULL,
      rating TINYINT UNSIGNED NOT NULL,
      body TEXT NOT NULL,
      is_approved TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrateCatalogColumns = require("./migrateCatalogColumns");
  await migrateCatalogColumns(pool);

  await q.query(`DROP PROCEDURE IF EXISTS add_booking`);
  await q.query(`
    CREATE PROCEDURE add_booking(
      IN p_name VARCHAR(255),
      IN p_email VARCHAR(255),
      IN p_contact VARCHAR(255),
      IN p_room VARCHAR(255),
      IN p_checkin DATE,
      IN p_checkout DATE,
      IN p_people INT
    )
    BEGIN
      INSERT INTO bookings (name, email, contact, room, checkin, checkout, people, status)
      VALUES (p_name, p_email, p_contact, p_room, p_checkin, p_checkout, p_people, 'pending');
    END
  `);

  await q.query(`DROP PROCEDURE IF EXISTS get_all_bookings`);
  await q.query(`
    CREATE PROCEDURE get_all_bookings()
    BEGIN
      SELECT * FROM bookings ORDER BY id DESC;
    END
  `);

  await q.query(`DROP PROCEDURE IF EXISTS update_booking_status`);
  await q.query(`
    CREATE PROCEDURE update_booking_status(
      IN p_id INT,
      IN p_status VARCHAR(50)
    )
    BEGIN
      UPDATE bookings SET status = p_status WHERE id = p_id;
    END
  `);
}

module.exports = ensureSchema;
