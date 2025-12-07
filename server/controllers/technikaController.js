const Technika = require('../models/Technika');

const isNonEmptyString = (val, minLen = 1) =>
  typeof val === 'string' && val.trim().length >= minLen;

const isPositiveInt = (val) => Number.isInteger(val) && val > 0;

function validateTechnikaBody(body) {
  const errors = [];

  const brand = body.brand?.toString().trim();
  const typ = body.typ?.toString().trim();
  const stav = body.stav?.toString().trim();
  const poradove_cislo =
    body.poradove_cislo !== undefined ? Number(body.poradove_cislo) : undefined;
  const kategoria = body.kategoria?.toString().trim() || 'Svetlo';

  if (!isNonEmptyString(brand, 3)) {
    errors.push('Brand musí mať aspoň 3 znaky.');
  }

  if (!isNonEmptyString(typ, 3)) {
    errors.push('Typ musí mať aspoň 3 znaky.');
  }

  if (!['OK', 'servis'].includes(stav)) {
    errors.push('Stav musí byť "OK" alebo "servis".');
  }

  if (!isPositiveInt(poradove_cislo)) {
    errors.push('Poradové číslo musí byť kladné celé číslo.');
  }

  if (!['Svetlo', 'Zvuk', 'Kable', 'Strecha', 'Servis'].includes(kategoria)) {
    errors.push('Neplatná kategória techniky.');
  }

  return {
    errors,
    brand,
    typ,
    stav,
    poradove_cislo,
    kategoria,
  };
}

exports.createTechnika = async (req, res) => {
  try {
    const {
      errors,
      brand,
      typ,
      stav,
      poradove_cislo,
      kategoria,
    } = validateTechnikaBody(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // KONTROLA DUPLICITY:
    // pre rovnakú kategóriu (Svetlo), rovnaký typ a rovnaké poradové číslo
    const exists = await Technika.existsByKategorieTypPoradove(
      kategoria,
      typ,
      poradove_cislo
    );

    if (exists) {
      return res.status(400).json({
        errors: [
          'Pre tento typ techniky už existuje záznam s rovnakým poradovým číslom.',
        ],
      });
    }

    const newItem = await Technika.create({
      kategoria,
      brand,
      typ,
      stav,
      poradove_cislo,
      obrazok_url: req.body.obrazok_url || null,
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chyba servera.' });
  }
};


exports.getTechnika = async (req, res) => {
  try {
    const rows = await Technika.findAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chyba servera.' });
  }
};

exports.deleteTechnika = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await Technika.deleteById(Number(id));
    if (!ok) {
      return res.status(404).json({ error: 'Položka neexistuje.' });
    }
    res.json({ message: 'Položka zmazaná.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chyba servera.' });
  }
};

exports.updateTechnika = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      errors,
      brand,
      typ,
      stav,
      poradove_cislo,
    } = validateTechnikaBody(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updated = await Technika.updateById(Number(id), {
      brand,
      typ,
      stav,
      poradove_cislo,
      obrazok_url: req.body.obrazok_url || null,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Položka neexistuje.' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chyba servera.' });
  }
};
