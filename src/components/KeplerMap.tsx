import React, { useImperativeHandle, forwardRef, ForwardRefRenderFunction } from 'react';

// Simplified PointType to match the new flat structure
type IsochroneProfile = 'walking' | 'cycling' | 'driving';
type ContourMode = 'manual' | 'increment';
type IncrementType = '5-increment' | '10-increment' | '15-increment' | null;

interface PointType {
  id: string;
  label: string;
  location: [number, number];
  travelMode: IsochroneProfile;
  color: string;
  visible: boolean;
  polygonOpacity: number;
  polygonVisible: boolean;
  lineVisible: boolean;
  contourMode: ContourMode;
  contourValue: number | IncrementType;
  active: boolean;
}

interface KeplerMapProps {
  points: PointType[];
  selectedPointIndex: number;
  setMarkerLocation: (idx: number, coords: [number, number]) => void;
  geoLocked: boolean;
  mapParams?: {
    profile: string;
    minutes: number[];
    colors: string[];
    polygonVisible: boolean[];
    lineVisible: boolean[];
    lineColors: string[];
    polygonColors: string[];
    lineOpacities: number[];
    polygonOpacities: number[];
  };
}

interface KeplerMapImperativeHandle {
  centerOnPoint: (lngLat: [number, number]) => void;
}

const KeplerMap: ForwardRefRenderFunction<KeplerMapImperativeHandle, KeplerMapProps> = (
  { points, selectedPointIndex, setMarkerLocation, geoLocked, mapParams },
  ref
) => {
  useImperativeHandle(ref, () => ({
    centerOnPoint: (lngLat: [number, number]) => {
      console.log('🗺️ KeplerMap: Center on point called:', lngLat);
      // TODO: Implement centering in kepler.gl
    }
  }));

  console.log('🗺️ ReviDeck KeplerMap with Webpack is rendering!');
  console.log('Props:', { points, selectedPointIndex, geoLocked });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Placeholder for kepler.gl - will implement after Redux setup */}
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        color: 'white'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          🗺️ ReviDeck.com
        </div>
        <div style={{ fontSize: '18px' }}>
          kepler.gl + Webpack Setup Complete!
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7, textAlign: 'center' }}>
          kepler.gl installed successfully in Webpack environment<br/>
          Next: Set up Redux store and integrate kepler.gl component
        </div>
      </div>
      
      {/* Success overlay */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(34, 139, 34, 0.9)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        ✅ Webpack + kepler.gl Ready!
      </div>
      
      {/* Info overlay */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '15px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        🚀 ReviDeck.com - Ready for kepler.gl integration
      </div>
    </div>
  );
};

export default forwardRef(KeplerMap); 