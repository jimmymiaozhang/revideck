import React, { useRef, useEffect, useImperativeHandle, forwardRef, ForwardRefRenderFunction } from 'react';
import mapboxgl, { Map as MapboxMapType, Marker as MapboxMarkerType, LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import chroma from 'chroma-js';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

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

interface MapboxMapProps {
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

interface MapboxMapImperativeHandle {
  centerOnPoint: (lngLat: [number, number]) => void;
}

const getProfileForApi = (travelMode: string) => {
  if (travelMode.startsWith('mapbox/')) {
    return travelMode.replace('mapbox/', '');
  }
  return travelMode;
};

const isValidLngLat = (loc: any): loc is [number, number] => {
  return (
    Array.isArray(loc) &&
    loc.length === 2 &&
    typeof loc[0] === 'number' &&
    typeof loc[1] === 'number' &&
    !isNaN(loc[0]) &&
    !isNaN(loc[1])
  );
};

const createCustomMarkerElement = (label: string, color: string) => {
  const el = document.createElement('div');
  el.className = 'custom-marker-circle';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.backgroundColor = `#${color}`;
  el.style.borderRadius = '50%';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.color = '#fff';
  el.style.fontWeight = 'bold';
  el.style.fontSize = '12px';
  el.style.border = '2px solid #fff';
  el.style.boxShadow = '0 1.5px 4px rgba(0,0,0,0.16)';
  el.textContent = label;
  return el;
};

const MapboxMap: ForwardRefRenderFunction<MapboxMapImperativeHandle, MapboxMapProps> = (
  { points, selectedPointIndex, setMarkerLocation, geoLocked, mapParams },
  ref
) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMapType | null>(null);
  const markers = useRef<{ [id: string]: MapboxMarkerType }>({});

  // Helper to add isochrone layers for a point
  const addIsochroneForPoint = async (pt: PointType) => {
    if (!map.current || !pt.visible || !isValidLngLat(pt.location)) return;

    const coords = pt.location;
    const profile = getProfileForApi(pt.travelMode);
    const isIncremental = pt.contourMode === 'increment';

    let minutes: number[];
    let gradientColors: string[] = []; // Will hold colors with '#'

    if (isIncremental && typeof pt.contourValue === 'string') {
      let base = 5, step = 5;
      if (pt.contourValue === '10-increment') { base = 10; step = 10; }
      if (pt.contourValue === '15-increment') { base = 15; step = 15; }
      minutes = Array.from({ length: 4 }, (_, i) => base + i * step);

      const userColor = `#${pt.color}`;
      const lightColor = chroma(userColor).brighten(3.5).saturate(0.5).hex();
      gradientColors = chroma.scale([lightColor, userColor]).mode('lab').colors(4).reverse();
    } else {
      minutes = [pt.contourValue as number];
      // For manual mode, gradientColors is not used, but we can leave it empty.
    }
    
    // Remove previous layers/source for this point
    const srcId = `isochrones-${pt.id}`;
    const fillId = `isochrones-fill-${pt.id}`;
    const lineId = `isochrones-line-${pt.id}`;
    if (map.current?.getLayer(fillId)) map.current.removeLayer(fillId);
    if (map.current?.getLayer(lineId)) map.current.removeLayer(lineId);
    if (map.current?.getSource(srcId)) map.current.removeSource(srcId);
    
    // Fetch isochrone - remove contours_colors, we will handle coloring client-side
    const url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${coords.join(',')}?contours_minutes=${minutes.join(',')}&polygons=true&access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      map.current.addSource(srcId, {
        type: 'geojson',
        data: data
      });
      
      const fillColorExpression = isIncremental
        ? ['interpolate', ['linear'], ['get', 'contour'], ...minutes.flatMap((m, i) => [m, gradientColors[i]])]
        : `#${pt.color}`;

      if (pt.polygonVisible) {
        map.current.addLayer({
          id: fillId,
          type: 'fill',
          source: srcId,
          layout: {},
          paint: {
            'fill-color': fillColorExpression as any, // Use `as any` to satisfy TS for complex expression
            'fill-opacity': pt.polygonOpacity / 100,
          } as mapboxgl.FillPaint,
        });
      }
      
      if (pt.lineVisible) {
        map.current.addLayer({
          id: lineId,
          type: 'line',
          source: srcId,
          layout: {},
          paint: {
            'line-color': fillColorExpression as any, // Lines should match polygon colors
            'line-width': 1.5,
            'line-opacity': 1, // Make lines fully opaque for visibility
          } as mapboxgl.LinePaint,
        });
      }
    } catch (e) {
      console.error('Error fetching isochrones for point', pt.label, e);
    }
  };

  // Helper to remove isochrone layers for a specific point ID
  const removeIsochroneForPoint = (pointId: string) => {
    if (!map.current) return;
    
    const srcId = `isochrones-${pointId}`;
    const fillId = `isochrones-fill-${pointId}`;
    const lineId = `isochrones-line-${pointId}`;
    
    if (map.current.getLayer(fillId)) map.current.removeLayer(fillId);
    if (map.current.getLayer(lineId)) map.current.removeLayer(lineId);
    if (map.current.getSource(srcId)) map.current.removeSource(srcId);
  };

  // Create map and markers only once
  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: points[0].location as LngLatLike,
      zoom: 11.5,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');
    
    map.current.on('load', () => {
      // Now that the map is loaded, we can safely add markers and isochrones.
      updateMarkersAndIsochrones();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Define a reusable function for updates
  const updateMarkersAndIsochrones = () => {
    if (!map.current) return;

    const existingMarkerIds = Object.keys(markers.current);
    const activePointIds = points.filter(p => p.active).map(p => p.id);

    // Remove markers for inactive points
    existingMarkerIds.forEach(id => {
      if (!activePointIds.includes(id)) {
        markers.current[id].remove();
        delete markers.current[id];
        removeIsochroneForPoint(id);
      }
    });
    
    // Update or create markers for active points only
    points.forEach((pt, idx) => {
      if (!pt.active || !isValidLngLat(pt.location)) return;
      
      let marker = markers.current[pt.id];
      if (!marker) {
        marker = new mapboxgl.Marker({
          draggable: !geoLocked,
          element: createCustomMarkerElement(pt.label, pt.color)
        })
          .setLngLat(pt.location as LngLatLike)
          .addTo(map.current!);
        markers.current[pt.id] = marker;
        
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          setMarkerLocation(idx, [lngLat.lng, lngLat.lat]);
        });
      } else {
        marker.setLngLat(pt.location as LngLatLike);
        marker.setDraggable(!geoLocked);
        const el = marker.getElement();
        if (el.textContent !== pt.label || el.style.backgroundColor !== `#${pt.color}`) {
          el.textContent = pt.label;
          el.style.backgroundColor = `#${pt.color}`;
        }
      }
    });

    // Update isochrones for all active and visible points
    points.filter(pt => pt.active && pt.visible).forEach(pt => addIsochroneForPoint(pt));
  };

  // Update markers and isochrones when points change
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return; // Don't run if map not ready

    updateMarkersAndIsochrones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, geoLocked]);

  useImperativeHandle(ref, () => ({
    centerOnPoint: (lngLat: [number, number]) => {
      if (map.current && lngLat) {
        map.current.flyTo({ center: lngLat, zoom: 11.5 });
      }
    }
  }));

  return (
    <div
      ref={mapContainer}
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        marginRight: '40px',
        borderRadius: '8px'
      }}
    />
  );
};

export default forwardRef(MapboxMap);