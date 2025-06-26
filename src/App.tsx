import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import MapScanner from './pages/MapScanner';
import MapScannerTool from './pages/MapScannerTool';
import NearMe from './pages/NearMe';
import FacadeGenerator from './pages/FacadeGenerator';
import About from './pages/About';
import AccountSettings from './pages/AccountSettings';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { useEffect } from 'react';

function AppContent() {
  const location = useLocation();
  // Hide Navigation on /MS/tool
  const hideNav = location.pathname === '/MS/tool';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100vw',
      bgcolor: '#f5f5f5',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {!hideNav && <Navigation />}
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          width: '100%'
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MS" element={<MapScanner />} />
          <Route path="/MS/tool" element={<MapScannerTool />} />
          <Route path="/NM" element={<NearMe />} />
          <Route path="/FG" element={<FacadeGenerator />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<AccountSettings />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
