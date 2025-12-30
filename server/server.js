const express = require("express");
const cors = require("cors");
const { getAll, addItem, deleteItem, updateItem } = require("./technikaStore");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// validácia na servery
function validateTechnika(body) {
  const errors = {};
  const { brand, typ, stav, poradoveCislo } = body;

  if (!brand || brand.trim().length < 3) {
    errors.brand = "Brand musí mať aspoň 3 znaky.";
  }
  if (!typ || typ.trim().length < 3) {
    errors.typ = "Typ musí mať aspoň 3 znaky.";
  }
  if (!stav || !["OK", "servis"].includes(stav)) {
    errors.stav = "Stav musí byť 'OK' alebo 'servis'.";
  }
  if (poradoveCislo === undefined || poradoveCislo === null) {
    errors.poradoveCislo = "Poradové číslo je povinné.";
  } else if (isNaN(Number(poradoveCislo)) || Number(poradoveCislo) <= 0) {
    errors.poradoveCislo = "Poradové číslo musí byť kladné číslo.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// POST /api/technika
app.post("/api/technika", (req, res) => {
  const { isValid, errors } = validateTechnika(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  const nova = addItem(req.body);
  res.status(201).json(nova);
});

// GET /api/technika
app.get("/api/technika", (req, res) => {
  res.json(getAll());
});

// DELETE /api/technika/:id
app.delete("/api/technika/:id", (req, res) => {
  const id = req.params.id;
  const success = deleteItem(id);
  if (!success) {
    return res.status(404).json({ message: "Položka neexistuje." });
  }
  res.json({ message: "Položka zmazaná." });
});

// PUT /api/technika/:id
app.put("/api/technika/:id", (req, res) => {
  const { isValid, errors } = validateTechnika(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const id = req.params.id;
  const updated = updateItem(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: "Položka neexistuje." });
  }
  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`Server beží na http://localhost:${PORT}`);
});
