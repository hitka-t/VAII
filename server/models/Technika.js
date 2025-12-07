const db = require('../config/db');

const Technika = {
  // Vytvorenie novej techniky
  async create(data) {
    const { kategoria, brand, typ, stav, poradove_cislo, obrazok_url } = data;

    const [result] = await db.execute(
      `INSERT INTO technika (kategoria, brand, typ, stav, poradove_cislo, obrazok_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [kategoria, brand, typ, stav, poradove_cislo, obrazok_url || null]
    );

    const [rows] = await db.execute(
      'SELECT * FROM technika WHERE id = ?',
      [result.insertId]
    );

    return rows[0];
  },

  // Zoznam všetkej techniky
  async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM technika ORDER BY created_at DESC'
    );
    return rows;
  },

  // KONTROLA DUPLICITY: existuje kategoria + typ + poradove_cislo?
  async existsByKategorieTypPoradove(kategoria, typ, poradove_cislo) {
    const [rows] = await db.execute(
      'SELECT id FROM technika WHERE kategoria = ? AND typ = ? AND poradove_cislo = ? LIMIT 1',
      [kategoria, typ, poradove_cislo]
    );
    return rows.length > 0;
  },

  // Zmazanie podľa ID
  async deleteById(id) {
    const [result] = await db.execute(
      'DELETE FROM technika WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Update podľa ID
  async updateById(id, data) {
    const { brand, typ, stav, poradove_cislo, obrazok_url } = data;

    await db.execute(
      `UPDATE technika
       SET brand = ?, typ = ?, stav = ?, poradove_cislo = ?, obrazok_url = ?
       WHERE id = ?`,
      [brand, typ, stav, poradove_cislo, obrazok_url || null, id]
    );

    const [rows] = await db.execute(
      'SELECT * FROM technika WHERE id = ?',
      [id]
    );

    return rows[0];
  },
};

module.exports = Technika;
