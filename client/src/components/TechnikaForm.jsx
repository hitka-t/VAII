import { useState } from 'react';

function TechnikaForm({ apiUrl, defaultKategoria, onCreated, onError }) {
  const [brand, setBrand] = useState('');
  const [typ, setTyp] = useState('');
  const [stav, setStav] = useState('OK');
  const [poradoveCislo, setPoradoveCislo] = useState('');
  const [obrazokUrl, setObrazokUrl] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!brand || brand.trim().length < 3) {
      errs.brand = 'Brand musí mať aspoň 3 znaky.';
    }
    if (!typ || typ.trim().length < 3) {
      errs.typ = 'Typ musí mať aspoň 3 znaky.';
    }
    if (!['OK', 'servis'].includes(stav)) {
      errs.stav = 'Stav musí byť OK alebo servis.';
    }
    const num = Number(poradoveCislo);
    if (!poradoveCislo || !Number.isInteger(num) || num <= 0) {
      errs.poradoveCislo = 'Poradové číslo musí byť kladné celé číslo.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      const res = await fetch(`${apiUrl}/technika`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kategoria: defaultKategoria,
          brand,
          typ,
          stav,
          poradove_cislo: Number(poradoveCislo),
          obrazok_url: obrazokUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          onError(data.errors.join(' '));
        } else {
          onError(data.error || 'Chyba pri uložení.');
        }
        return;
      }

      onCreated(data);

      // vyčistiť formulár
      setBrand('');
      setTyp('');
      setStav('OK');
      setPoradoveCislo('');
      setObrazokUrl('');
      setErrors({});
    } catch (err) {
      console.error(err);
      onError('Chyba pripojenia na server.');
    }
  };

  return (
    <form className="technika-form" onSubmit={handleSubmit}>
      <h2>Pridať techniku</h2>

      <div className="mb-3">
        <label className="form-label">Brand *</label>
        <input
          type="text"
          className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        {errors.brand && (
          <div className="invalid-feedback">{errors.brand}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Typ *</label>
        <input
          type="text"
          className={`form-control ${errors.typ ? 'is-invalid' : ''}`}
          value={typ}
          onChange={(e) => setTyp(e.target.value)}
        />
        {errors.typ && <div className="invalid-feedback">{errors.typ}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Stav *</label>
        <select
          className={`form-select ${errors.stav ? 'is-invalid' : ''}`}
          value={stav}
          onChange={(e) => setStav(e.target.value)}
        >
          <option value="OK">OK</option>
          <option value="servis">servis</option>
        </select>
        {errors.stav && <div className="invalid-feedback">{errors.stav}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Poradové číslo *</label>
        <input
          type="number"
          className={`form-control ${
            errors.poradoveCislo ? 'is-invalid' : ''
          }`}
          value={poradoveCislo}
          onChange={(e) => setPoradoveCislo(e.target.value)}
        />
        {errors.poradoveCislo && (
          <div className="invalid-feedback">{errors.poradoveCislo}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Obrázok (URL)</label>
        <input
          type="text"
          className="form-control"
          value={obrazokUrl}
          onChange={(e) => setObrazokUrl(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-submit">
        Uložiť
      </button>
    </form>
  );
}

export default TechnikaForm;
