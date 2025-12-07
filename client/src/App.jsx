import { Routes, Route } from 'react-router-dom';
import NavbarMain from './components/Navbar';
import Home from './pages/Home';
import Svetlo from './pages/Svetlo';
import Zvuk from './pages/Zvuk';
import Kable from './pages/Kable';
import Strecha from './pages/Strecha';
import Servis from './pages/Servis';

function App() {
  return (
    <div className="app-root">
      <NavbarMain />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/svetlo" element={<Svetlo />} />
          <Route path="/zvuk" element={<Zvuk />} />
          <Route path="/kable" element={<Kable />} />
          <Route path="/strecha" element={<Strecha />} />
          <Route path="/servis" element={<Servis />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
