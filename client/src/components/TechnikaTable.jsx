import { useState } from "react";

function TechnikaTable({ items, onDelete, onUpdate }) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (item) => {
    setEditId(item.id);
    setEditForm({
      id: item.id,
      brand: item.brand,
      typ: item.typ,
      stav: item.stav,
      poradoveCislo: item.poradoveCislo,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(editForm);
    setEditId(null);
  };

  return (
    <div className="table-wrapper">
      <table className="technika-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Typ</th>
            <th>Stav</th>
            <th>Poradové číslo</th>
            <th>Akcie</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="6" className="empty-row">
                Zatiaľ žiadne položky.
              </td>
            </tr>
          )}

          {items.map((item) =>
            editId === item.id ? (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <input
                    name="brand"
                    value={editForm.brand}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    name="typ"
                    value={editForm.typ}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <select
                    name="stav"
                    value={editForm.stav}
                    onChange={handleChange}
                  >
                    <option value="OK">OK</option>
                    <option value="servis">servis</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    name="poradoveCislo"
                    value={editForm.poradoveCislo}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <button className="btn-secondary" onClick={handleSave}>
                    Uložiť
                  </button>
                  <button className="btn-link" onClick={cancelEdit}>
                    Zrušiť
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.brand}</td>
                <td>{item.typ}</td>
                <td>
                  <span
                    className={
                      item.stav === "OK" ? "badge badge-ok" : "badge badge-servis"
                    }
                  >
                    {item.stav}
                  </span>
                </td>
                <td>{item.poradoveCislo}</td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => startEdit(item)}
                  >
                    Upraviť
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => onDelete(item.id)}
                  >
                    Zmazať
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TechnikaTable;
