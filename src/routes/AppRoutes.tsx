import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MapScanner from '../pages/MapScanner';
import MapScannerTool from '../pages/MapScannerTool';
import NearMe from '../pages/NearMe';
import FacadeGenerator from '../pages/FacadeGenerator';
import About from '../pages/About';
import AccountSettings from '../pages/AccountSettings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/MS" element={<MapScanner />} />
      <Route path="/MS/tool" element={<MapScannerTool />} />
      <Route path="/NM" element={<NearMe />} />
      <Route path="/FG" element={<FacadeGenerator />} />
      <Route path="/about" element={<About />} />
      <Route path="/account" element={<AccountSettings />} />
    </Routes>
  );
};

export default AppRoutes; 