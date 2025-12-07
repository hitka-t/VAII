import { useState } from 'react';

function TechnikaTable({ items, apiUrl, onDeleted, onUpdated, onError }) {
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const startEdit = (item) => {
    setEditId(item.id);
    setEditValues({
      brand: item.brand,
      typ: item.typ,
      stav: item.stav,
      poradove_cislo: item.poradove_cislo,
      obrazok_url: item.obrazok_url || '',
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValues({});
  };

  const handleChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/technika/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: editValues.brand,
          typ: editValues.typ,
          stav: editValues.stav,
          poradove_cislo: Number(editValues.poradove_cislo),
          obrazok_url: editValues.obrazok_url || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          onError(data.errors.join(' '));
        } else {
          onError(data.error || 'Chyba pri úprave.');
        }
        return;
      }

      onUpdated(data);
      cancelEdit();
    } catch (err) {
      console.error(err);
      onError('Chyba pripojenia pri úprave.');
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Naozaj chceš zmazať túto položku?')) return;
    try {
      const res = await fetch(`${apiUrl}/technika/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error || 'Chyba pri mazaní.');
        return;
      }
      onDeleted(id);
    } catch (err) {
      console.error(err);
      onError('Chyba pripojenia pri mazaní.');
    }
  };

  return (
  <div className="technika-table-wrapper">
    <h2>Zoznam techniky</h2>

    <div className="table-responsive">
      <table className="table table-striped table-hover technika-table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Typ</th>
            <th>Stav</th>
            <th>Poradové číslo</th>
            <th>Obrázok</th>
            <th>Akcie</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                Žiadne záznamy.
              </td>
            </tr>
          )}

          {items.map((item) => (
            <tr key={item.id}>
              {/* BRAND */}
              <td>
                {editId === item.id ? (
                  <input
                    className="form-control form-control-sm"
                    value={editValues.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                  />
                ) : (
                  item.brand
                )}
              </td>

              {/* TYP */}
              <td>
                {editId === item.id ? (
                  <input
                    className="form-control form-control-sm"
                    value={editValues.typ}
                    onChange={(e) => handleChange('typ', e.target.value)}
                  />
                ) : (
                  item.typ
                )}
              </td>

              {/* STAV */}
              <td>
                {editId === item.id ? (
                  <select
                    className="form-select form-select-sm"
                    value={editValues.stav}
                    onChange={(e) => handleChange('stav', e.target.value)}
                  >
                    <option value="OK">OK</option>
                    <option value="servis">servis</option>
                  </select>
                ) : (
                  item.stav
                )}
              </td>

              {/* PORADOVÉ ČÍSLO */}
              <td>
                {editId === item.id ? (
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={editValues.poradove_cislo}
                    onChange={(e) =>
                      handleChange('poradove_cislo', e.target.value)
                    }
                  />
                ) : (
                  item.poradove_cislo
                )}
              </td>

              {/* OBRÁZOK */}
              <td>
                {item.obrazok_url && (
                  <img
                    src={item.obrazok_url}
                    alt={`${item.brand} ${item.typ}`}
                    className="technika-thumb"
                  />
                )}
              </td>

              {/* AKCIE */}
              <td>
                {editId === item.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => saveEdit(item.id)}
                    >
                      Uložiť
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={cancelEdit}
                    >
                      Zrušiť
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => startEdit(item)}
                    >
                      Upraviť
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteItem(item.id)}
                    >
                      Zmazať
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default TechnikaTable;
