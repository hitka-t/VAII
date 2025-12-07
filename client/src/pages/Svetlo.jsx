import { useEffect, useState } from "react";
import TechnikaForm from "../components/TechnikaForm";
import TechnikaTable from "../components/TechnikaTable";
import Notification from "../components/Notification";
import Modal from "../components/Modal";

const API_URL = "http://localhost:5000/api";

function Svetlo() {
  const [technika, setTechnika] = useState([]);
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch(`${API_URL}/technika`);
      const data = await res.json();
      setTechnika(data.filter((item) => item.kategoria === "Svetlo"));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreated = (item) => {
    setTechnika((prev) => [item, ...prev]);
    setNotification({ type: "success", message: "Technika bola pridaná." });
    setIsModalOpen(false); // po úspešnom pridaní zavrieme modal
  };

  const handleDeleted = (id) => {
    setTechnika((prev) => prev.filter((t) => t.id !== id));
    setNotification({ type: "success", message: "Technika bola zmazaná." });
  };

  const handleUpdated = (updated) => {
    setTechnika((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setNotification({ type: "success", message: "Technika bola upravená." });
  };

  const filtered = technika.filter((item) => {
    const q = filter.toLowerCase();
    return (
      item.brand.toLowerCase().includes(q) ||
      item.typ.toLowerCase().includes(q) ||
      String(item.poradove_cislo).includes(q)
    );
  });

  return (
    <div className="page page-svetlo">
      {/* hlavička s tlačidlom vpravo */}
      <div className="page-header">
        <h1>Svetlá</h1>
        <button
          type="button"
          className="btn btn-primary btn-add-technika"
          onClick={() => setIsModalOpen(true)}
        >
          + Pridať svetlo
        </button>
      </div>

      {/* filter */}
      <div className="toolbar">
        <input
          type="text"
          className="form-control filter-input"
          placeholder="Vyhľadaj podľa brand / typ / číslo..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* tabuľka */}
      <TechnikaTable
        items={filtered}
        apiUrl={API_URL}
        onDeleted={handleDeleted}
        onUpdated={handleUpdated}
        onError={(msg) =>
          setNotification({ type: "error", message: msg || "Chyba." })
        }
      />

      {/* popup modal s formulárom */}
      <Modal
        title="Pridať svetlo"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <TechnikaForm
          apiUrl={API_URL}
          defaultKategoria="Svetlo"
          onCreated={handleCreated}
          onError={(msg) =>
            setNotification({ type: "error", message: msg || "Chyba." })
          }
        />
      </Modal>

      {/* notifikácie */}
      {notification && (
        <Notification
          type={notification.type}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Notification>
      )}
    </div>
  );
}

export default Svetlo;
