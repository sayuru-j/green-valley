/**
 * Add catalog columns on existing DBs (CREATE TABLE IF NOT EXISTS skips if table exists).
 */
async function columnExists(q, tableName, columnName) {
  const [rows] = await q.query(
    `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return Number(rows[0].c) > 0;
}

async function addColumn(q, tableName, columnDefinition) {
  await q.query(`ALTER TABLE \`${tableName}\` ADD COLUMN ${columnDefinition}`);
}

async function migrateCatalogColumns(pool) {
  const q = pool.promise();

  const steps = [
    ["rooms", "subtitle", "subtitle VARCHAR(500) NULL"],
    ["rooms", "image_url", "image_url VARCHAR(2048) NULL"],
    ["rooms", "max_occupancy", "max_occupancy INT UNSIGNED NULL"],
    ["rooms", "display_order", "display_order INT NOT NULL DEFAULT 0"],
    ["menu_items", "image_url", "image_url VARCHAR(2048) NULL"],
    ["menu_items", "dietary_note", "dietary_note VARCHAR(255) NULL"],
    ["menu_items", "is_featured", "is_featured TINYINT(1) NOT NULL DEFAULT 0"],
    ["menu_items", "display_order", "display_order INT NOT NULL DEFAULT 0"],
    ["banquet_packages", "image_url", "image_url VARCHAR(2048) NULL"],
    ["banquet_packages", "max_guests", "max_guests INT UNSIGNED NULL"],
    ["banquet_packages", "highlights", "highlights TEXT NULL"],
    ["banquet_packages", "display_order", "display_order INT NOT NULL DEFAULT 0"],
  ];

  for (const [table, column, ddl] of steps) {
    if (await columnExists(q, table, column)) {
      continue;
    }
    try {
      await addColumn(q, table, ddl);
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      if (!/Duplicate column name/i.test(msg)) {
        throw err;
      }
    }
  }
}

module.exports = migrateCatalogColumns;
