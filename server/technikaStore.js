let data = [];
let lastId = 0;

function getAll() {
  return data;
}

function addItem({ brand, typ, stav, poradoveCislo }) {
  const newItem = {
    id: (++lastId).toString(),
    brand: brand.trim(),
    typ: typ.trim(),
    stav,
    poradoveCislo: Number(poradoveCislo),
    createdAt: new Date().toISOString(),
  };
  data.push(newItem);
  return newItem;
}

function deleteItem(id) {
  const index = data.findIndex((item) => item.id === id);
  if (index === -1) return false;
  data.splice(index, 1);
  return true;
}

function updateItem(id, { brand, typ, stav, poradoveCislo }) {
  const item = data.find((i) => i.id === id);
  if (!item) return null;
  item.brand = brand.trim();
  item.typ = typ.trim();
  item.stav = stav;
  item.poradoveCislo = Number(poradoveCislo);
  return item;
}

module.exports = { getAll, addItem, deleteItem, updateItem };
