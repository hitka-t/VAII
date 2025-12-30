import { useEffect, useState } from "react";
import AddTechnikaForm from "./components/AddTechnikaForm";
import TechnikaTable from "./components/TechnikaTable";
import SearchBar from "./components/SearchBar";
import "./style.css";

function App() {
  const [technika, setTechnika] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterStav, setFilterStav] = useState("vsetko");
  const [popup, setPopup] = useState(null);

  const fetchTechnika = async () => {
    try {
      const res = await fetch("/api/technika");
      const data = await res.json();
      setTechnika(data);
    } catch (err) {
      console.error(err);
      setPopup({ type: "error", message: "Nepodarilo sa načítať techniku." });
    }
  };

  useEffect(() => {
    fetchTechnika();
  }, []);

  const handleAddSuccess = (newItem) => {
    setTechnika((prev) => [...prev, newItem]);
    setPopup({ type: "success", message: "Technika bola úspešne pridaná." });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm("Naozaj chceš zmazať túto položku?")) return;
    try {
      const res = await fetch(`/api/technika/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setTechnika((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setPopup({ type: "error", message: "Mazanie zlyhalo." });
    }
  };

  const handleUpdate = async (updatedItem) => {
    try {
      const res = await fetch(`/api/technika/${updatedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setTechnika((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
      setPopup({ type: "success", message: "Položka upravená." });
      setTimeout(() => setPopup(null), 3000);
    } catch (err) {
      console.error(err);
      setPopup({ type: "error", message: "Úprava zlyhala." });
    }
  };

  const filteredTechnika = technika.filter((item) => {
    const textMatch =
      item.brand.toLowerCase().includes(filterText.toLowerCase()) ||
      item.typ.toLowerCase().includes(filterText.toLowerCase());
    const stavMatch =
      filterStav === "vsetko" ? true : item.stav === filterStav;
    return textMatch && stavMatch;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Evidencia firemnej techniky</h1>
      </header>

      <main className="app-main">
        <section className="app-section">
          <h2>Pridať techniku</h2>
          <AddTechnikaForm onSuccess={handleAddSuccess} />
        </section>

        <section className="app-section">
          <div className="section-header">
            <h2>Zoznam techniky</h2>
            <SearchBar
              filterText={filterText}
              setFilterText={setFilterText}
              filterStav={filterStav}
              setFilterStav={setFilterStav}
            />
          </div>
          <TechnikaTable
            items={filteredTechnika}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </section>
      </main>

      {popup && <div className={`popup popup-${popup.type}`}>{popup.message}</div>}

      <footer className="app-footer">
        <small>© 2025 Evidencia techniky</small>
      </footer>
    </div>
  );
}

export default App;
