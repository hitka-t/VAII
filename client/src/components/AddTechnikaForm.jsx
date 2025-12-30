import { useState } from "react";

const defaultState = { brand: "", typ: "", stav: "OK", poradoveCislo: "" };

function AddTechnikaForm({ onSuccess }) {
  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.brand || formData.brand.trim().length < 3) {
      newErrors.brand = "Brand musí mať aspoň 3 znaky.";
    }
    if (!formData.typ || formData.typ.trim().length < 3) {
      newErrors.typ = "Typ musí mať aspoň 3 znaky.";
    }
    if (!["OK", "servis"].includes(formData.stav)) {
      newErrors.stav = "Stav musí byť OK alebo servis.";
    }
    if (!formData.poradoveCislo) {
      newErrors.poradoveCislo = "Poradové číslo je povinné.";
    } else if (isNaN(Number(formData.poradoveCislo))) {
      newErrors.poradoveCislo = "Poradové číslo musí byť číslo.";
    } else if (Number(formData.poradoveCislo) <= 0) {
      newErrors.poradoveCislo = "Poradové číslo musí byť kladné.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("/api/technika", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) setErrors(data.errors);
        return;
      }

      const newItem = await res.json();
      onSuccess(newItem);
      setFormData(defaultState);
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ global: "Odoslanie zlyhalo." });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {errors.global && <div className="form-error">{errors.global}</div>}

      <div className="form-row">
        <label htmlFor="brand">Brand *</label>
        <input
          id="brand"
          name="brand"
          type="text"
          value={formData.brand}
          onChange={handleChange}
        />
        {errors.brand && <span className="field-error">{errors.brand}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="typ">Typ *</label>
        <input
          id="typ"
          name="typ"
          type="text"
          value={formData.typ}
          onChange={handleChange}
        />
        {errors.typ && <span className="field-error">{errors.typ}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="stav">Stav *</label>
        <select
          id="stav"
          name="stav"
          value={formData.stav}
          onChange={handleChange}
        >
          <option value="OK">OK</option>
          <option value="servis">servis</option>
        </select>
        {errors.stav && <span className="field-error">{errors.stav}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="poradoveCislo">Poradové číslo *</label>
        <input
          id="poradoveCislo"
          name="poradoveCislo"
          type="number"
          min="1"
          value={formData.poradoveCislo}
          onChange={handleChange}
        />
        {errors.poradoveCislo && (
          <span className="field-error">{errors.poradoveCislo}</span>
        )}
      </div>

      <button type="submit" className="btn-primary">
        Pridať
      </button>
    </form>
  );
}

export default AddTechnikaForm;
