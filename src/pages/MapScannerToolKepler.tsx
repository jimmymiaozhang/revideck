import MapScannerToolNav from '../components/MapScannerToolNav';
import KeplerMap from '../components/KeplerMap';
import IsochroneControls from '../components/IsochroneControls';
import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SIDEBAR_WIDTH = 320;
const NAV_HEIGHT = 64;
const GAP = 16;

type IsochroneProfile = 'walking' | 'cycling' | 'driving';
type ContourMode = 'manual' | 'increment';
type IncrementType = '5-increment' | '10-increment' | '15-increment' | null;

interface Point {
  id: string;
  label: string;
  location: [number, number];
  travelMode: IsochroneProfile;
  color: string;
  visible: boolean;
  active: boolean;

  // --- SHARED STYLING ---
  polygonOpacity: number;
  polygonVisible: boolean;
  lineVisible: boolean;

  // --- CONTOUR STATE ---
  contourMode: ContourMode;
  contourValue: number | IncrementType; // e.g. 10 or '5-increment'
}

const DEFAULT_POINT = (): Point => ({
  id: uuidv4(),
  label: 'A',
  location: [-74.6527, 40.3462],
  travelMode: 'walking',
  color: '6A0B0B',
  visible: true,
  active: true,

  polygonOpacity: 15,
  polygonVisible: true,
  lineVisible: true,

  contourMode: 'manual',
  contourValue: 10,
});

const POINT_LABELS = ['A', 'B', 'C', 'D', 'E'];

// Create initial array with all 5 points, but only first one active
const createInitialPoints = (): Point[] => {
  return POINT_LABELS.map((label, index) => ({
    ...DEFAULT_POINT(),
    id: uuidv4(),
    label,
    active: index === 0, // Only first point is active initially
    visible: index === 0,
  }));
};

type PointType = Point;

const MapScannerToolKepler = () => {
  const [points, setPoints] = useState<PointType[]>(createInitialPoints());
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(0);
  const [geoLocked, setGeoLocked] = useState<boolean>(false);
  const mapRef = useRef<any>(null);

  // Add a ref to trigger the Snackbar in IsochroneControls
  const snackbarRef = useRef<{ show: () => void }>(null);

  // Helper to update a point by index
  const updatePoint = (idx: number, updater: (pt: PointType) => Partial<PointType>) => {
    setPoints(points => points.map((pt, i) => i === idx ? { ...pt, ...updater(pt) } : pt));
  };

  const setMarkerLocation = (idx: number, coords: [number, number]) => {
    updatePoint(idx, () => ({ location: coords }));
  };

  const handleProfileChange = (profile: IsochroneProfile) => {
    updatePoint(selectedPointIndex, () => ({ travelMode: profile }));
  };

  const handleContourDropdownChange = (index: number, value: string) => {
    const isManual = !value.includes('-increment');
    updatePoint(index, () => ({
      contourMode: isManual ? 'manual' : 'increment',
      contourValue: isManual ? parseInt(value, 10) : (value as IncrementType),
    }));
  };

  const handleColorChange = (color: string) => {
    updatePoint(selectedPointIndex, () => ({ color }));
  };

  const handleDisplayModeChange = (mode: 'polygons' | 'lines') => {
    if (mode === 'polygons') {
      updatePoint(selectedPointIndex, () => ({
        polygonVisible: true,
        lineVisible: true,
      }));
    } else { // mode === 'lines'
      updatePoint(selectedPointIndex, () => ({
        polygonVisible: false,
        lineVisible: true,
      }));
    }
  };

  const handlePolygonOpacityChange = (opacity: number) => {
    updatePoint(selectedPointIndex, () => ({ polygonOpacity: opacity }));
  };

  function handleDeletePoint(idx: number) {
    setPoints(prevPoints => {
      // Mark the point as inactive and reset all properties to defaults
      const newPoints = prevPoints.map((pt, i) => 
        i === idx ? {
          ...pt,
          active: false,
          visible: false,
          // Reset to default values
          travelMode: 'walking' as IsochroneProfile,
          color: '6A0B0B',
          polygonOpacity: 15,
          polygonVisible: true,
          lineVisible: true,
          contourMode: 'manual' as ContourMode,
          contourValue: 10,
        } : pt
      );

      // Find the next active point to select
      let newSelectedIdx = selectedPointIndex;
      if (idx === selectedPointIndex) {
        // The selected point was deleted, find the next active point
        const activePoints = newPoints.filter(p => p.active);
        if (activePoints.length > 0) {
          // Find the index of the first active point
          newSelectedIdx = newPoints.findIndex(p => p.active);
        } else {
          newSelectedIdx = 0; // Fallback to first point
        }
      }

      setSelectedPointIndex(newSelectedIdx);
      return newPoints;
    });
  }

  const handleAddPoint = () => {
    // Find the first inactive point
    const inactivePointIndex = points.findIndex(p => !p.active);
    
    if (inactivePointIndex === -1) {
      // No inactive points available (shouldn't happen if UI is properly controlled)
      snackbarRef.current?.show();
      return;
    }

    // Reactivate the first inactive point with a new location
    setPoints(prevPoints => {
      const currentPoint = prevPoints[selectedPointIndex];
      return prevPoints.map((pt, i) => 
        i === inactivePointIndex 
          ? {
              ...pt,
              active: true,
              visible: true,
              // Keep the default values that were set when deleted, but update location
              location: [
                currentPoint.location[0] + 0.01,
                currentPoint.location[1] + 0.01,
              ] as [number, number],
            }
          : pt
      );
    });
    
    setSelectedPointIndex(inactivePointIndex);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      boxSizing: 'border-box', 
      background: '#f5f5f5'
    }}>
      {/* Top Nav Bar */}
      <div style={{ margin: GAP, marginBottom: 0 }}>
        <MapScannerToolNav />
      </div>
      {/* Second Row: Sidebar + Map */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        margin: GAP, 
        marginTop: 85, 
        marginLeft: 15, 
        marginRight: 30, 
        height: 750 
      }}>
        {/* Sidebar */}
        <div style={{
          width: SIDEBAR_WIDTH,
          background: '#fff',
          height: '100%',
          borderRadius: 8,
          marginRight: GAP,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <IsochroneControls
            points={points}
            selectedPointIndex={selectedPointIndex}
            onSelectPoint={setSelectedPointIndex}
            onProfileChange={handleProfileChange}
            onContourDropdownChange={handleContourDropdownChange}
            onColorChange={handleColorChange}
            onDisplayModeChange={handleDisplayModeChange}
            onPolygonOpacityChange={handlePolygonOpacityChange}
            onDeletePoint={handleDeletePoint}
            onAddPoint={handleAddPoint}
            onUpdatePointLocation={(coords) => updatePoint(selectedPointIndex, () => ({ location: coords }))}
            geoLocked={geoLocked}
            setGeoLocked={setGeoLocked}
            onCenterMap={() => {
              if (mapRef.current) {
                mapRef.current.centerOnPoint(points[selectedPointIndex].location);
              }
            }}
            snackbarRef={snackbarRef}
          />
        </div>
        {/* Map */}
        <div style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          background: '#fff',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <KeplerMap
            ref={mapRef}
            points={points}
            selectedPointIndex={selectedPointIndex}
            setMarkerLocation={setMarkerLocation}
            geoLocked={geoLocked}
          />
        </div>
      </div>
      {/* Third Row: Stats Placeholder */}
      <div style={{
        margin: GAP,
        marginTop: 0,
        marginLeft: 15, 
        marginRight: 30,
        background: '#fff',
        borderRadius: 8,
        minHeight: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
        color: '#222',
        fontWeight: 500,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Statistics Coming Soon
      </div>
    </div>
  );
};

export default MapScannerToolKepler; 