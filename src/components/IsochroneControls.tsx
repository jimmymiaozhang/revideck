import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Box, Typography, TextField, ToggleButtonGroup, ToggleButton, IconButton, MenuItem, InputAdornment, Popover, Slider } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

// Define Point type locally to match MapScannerTool's new structure
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
  polygonOpacity: number;
  polygonVisible: boolean;
  lineVisible: boolean;
  contourMode: ContourMode;
  contourValue: number | IncrementType;
}

interface IsochroneControlsProps {
  points: Point[];
  selectedPointIndex: number;
  onSelectPoint: (idx: number) => void;
  onProfileChange: (profile: IsochroneProfile) => void;
  onContourDropdownChange: (index: number, value: string) => void;
  onColorChange: (color: string) => void;
  onDisplayModeChange: (mode: 'polygons' | 'lines') => void;
  onPolygonOpacityChange: (opacity: number) => void;
  onDeletePoint: (idx: number) => void;
  onAddPoint: () => void;
  onUpdatePointLocation: (coords: [number, number]) => void;
  geoLocked: boolean;
  setGeoLocked: (locked: boolean) => void;
  onCenterMap: () => void;
  snackbarRef?: React.Ref<{ show: () => void }>;
}

const MAX_POINTS = 5;

const IsochroneControls = (
  props: IsochroneControlsProps,
  ref: React.Ref<any>
) => {
  const {
    points,
    selectedPointIndex,
    onSelectPoint,
    onProfileChange,
    onContourDropdownChange,
    onColorChange,
    onDisplayModeChange,
    onPolygonOpacityChange,
    onDeletePoint,
    onAddPoint,
    onUpdatePointLocation,
    geoLocked,
    setGeoLocked,
    onCenterMap,
    snackbarRef
  } = props;

  const selectedPoint = points[selectedPointIndex];
  if (!selectedPoint || !selectedPoint.active) return null; // Or a loading/error state

  // Sort active points alphabetically by label for dropdown
  const activePoints = points.filter(p => p.active);
  const sortedPoints = [...activePoints].sort((a, b) => a.label.localeCompare(b.label));
  const sortedSelectedIndex = sortedPoints.findIndex(pt => pt.id === selectedPoint.id);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [pendingDeleteIdx, setPendingDeleteIdx] = useState<number | null>(null);

  useImperativeHandle(snackbarRef, () => ({
    show: () => {
      setSnackbarVisible(true);
      setTimeout(() => setSnackbarVisible(false), 3000);
    }
  }), []);

  const handleSelectPoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== 'add') {
      const selectedActivePoint = sortedPoints[Number(value)];
      const actualIndex = points.findIndex(p => p.id === selectedActivePoint.id);
      onSelectPoint(actualIndex);
    }
  };
  
  const handleContourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onContourDropdownChange(selectedPointIndex, event.target.value);
  };

  const manualTimes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  const incrementTimes = ['5-increment', '10-increment', '15-increment'];

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Multi-point dropdown with icons and add */}
      <TextField
        select
        label="Select Point"
        value={sortedSelectedIndex}
        onChange={handleSelectPoint}
        size="small"
        sx={{ width: '100%', fontSize: 13, '& .MuiInputBase-root': { fontSize: 13 }, '& .MuiInputLabel-root': { fontSize: 13 }, '& .MuiSelect-select': { fontSize: 13 } }}
        SelectProps={{
          renderValue: (selected) => {
            const idx = typeof selected === 'number' ? selected : parseInt(selected as string, 10);
            return <span style={{ fontWeight: 600 }}>{sortedPoints[idx]?.label || ''}</span>;
          }
        }}
      >
        {sortedPoints.map((pt, idx) => (
          <MenuItem key={pt.id} value={idx} style={{ fontSize: 13, display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: 1, fontWeight: idx === sortedSelectedIndex ? 600 : 400 }}>{pt.label}</span>
            <IconButton size="small" onClick={e => { e.stopPropagation(); setPendingDeleteIdx(points.findIndex(p => p.id === pt.id)); }} disabled={activePoints.length === 1}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
        {points.some(p => !p.active) && (
        <MenuItem value="add" onClick={onAddPoint} style={{ fontStyle: 'italic', color: '#888', fontSize: 13 }}>
          Add a point...
        </MenuItem>
        )}
      </TextField>

      {/* Geolocation Box Only (no label/divider) */}
      <Box
        sx={{
          border: '1.5px solid #bbb',
          borderRadius: 2,
          p: 1,
          background: '#fff',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          width: '100%',
          boxSizing: 'border-box',
          mb: 0,
          position: 'relative',
          minHeight: 64
        }}
      >
        {/* Left column: Longitude/Latitude inputs */}
        <Box sx={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5, width: '80%' }}>
          <Typography variant="body2" sx={{ fontSize: 13, color: '#000', mb: 0 }}>Longitude</Typography>
          <TextField
            value={selectedPoint.location[0]}
            onChange={e => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onUpdatePointLocation([val, selectedPoint.location[1]]);
            }}
            size="small"
            type="number"
            sx={{ width: '100%', height: 32, '& .MuiInputBase-root': { height: 32, minHeight: 32 } }}
            inputProps={{ step: 'any', style: { fontSize: 13, width: '100%', height: 32, padding: '4px 8px' } }}
            disabled={geoLocked}
          />
          <Typography variant="body2" sx={{ fontSize: 13, color: '#000', mb: 0, mt: 0 }}>Latitude</Typography>
          <TextField
            value={selectedPoint.location[1]}
            onChange={e => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onUpdatePointLocation([selectedPoint.location[0], val]);
            }}
            size="small"
            type="number"
            sx={{ width: '100%', height: 32, '& .MuiInputBase-root': { height: 32, minHeight: 32 } }}
            inputProps={{ step: 'any', style: { fontSize: 13, width: '100%', height: 32, padding: '4px 8px' } }}
            disabled={geoLocked}
          />
        </Box>
        {/* Right column: Lock and Target icons */}
        <Box sx={{ width: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
          <IconButton size="small" onClick={() => setGeoLocked(!geoLocked)} sx={{ mb: 0.5 }}>
            {geoLocked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small" onClick={onCenterMap}>
            <GpsFixedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Travel Mode */}
      <ToggleButtonGroup
        value={selectedPoint.travelMode}
        exclusive
        onChange={(_, value) => value && onProfileChange(value)}
        sx={{
          width: '100%',
          '& .MuiToggleButton-root': {
            color: '#444',
            backgroundColor: '#f7f7f7',
            border: '1px solid #ddd',
            '&.Mui-selected': {
              color: '#fff',
              backgroundColor: '#888',
              border: '1px solid #888',
            },
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            '&.Mui-focusVisible': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
          },
        }}
        color="standard"
        size="small"
        fullWidth
      >
        <ToggleButton value="walking" sx={{ px: 1, py: 0.5, fontSize: 13, textTransform: 'none' }} fullWidth>
          <DirectionsWalkIcon sx={{ mr: 0.5, fontSize: 15 }} /> Walking
        </ToggleButton>
        <ToggleButton value="cycling" sx={{ px: 1, py: 0.5, fontSize: 13, textTransform: 'none' }} fullWidth>
          <DirectionsBikeIcon sx={{ mr: 0.5, fontSize: 15 }} /> Cycling
        </ToggleButton>
        <ToggleButton value="driving" sx={{ px: 1, py: 0.5, fontSize: 13, textTransform: 'none' }} fullWidth>
          <DirectionsCarIcon sx={{ mr: 0.5, fontSize: 15 }} /> Driving
        </ToggleButton>
      </ToggleButtonGroup>
      
      {/* Time/Contour Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
            <TextField
              select
          value={String(selectedPoint.contourValue)}
          onChange={handleContourChange}
              size="small"
              sx={{
                width: '100%',
                color: '#000',
                fontSize: 13,
                height: 32,
            '& .MuiInputBase-root': { height: 32, minHeight: 32, fontSize: 13, padding: '0 8px' },
                '& .MuiInputLabel-root': { fontSize: 13 },
                '& .MuiSelect-icon': { fontSize: 20 },
                '& .MuiSelect-select': { fontSize: '13px !important' },
              }}
          inputProps={{ style: { fontSize: 13, height: 32, padding: '0 8px' } }}
        >
          {manualTimes.map((val) => (
            <MenuItem key={val} value={String(val)} style={{ fontSize: '13px !important', color: '#000', minHeight: 0, paddingTop: 2, paddingBottom: 2, lineHeight: 1.2 }}>
                    {val} mins
                  </MenuItem>
          ))}
              <Divider />
          {incrementTimes.map((val) => (
            <MenuItem key={val} value={val} style={{ fontSize: '13px !important', color: '#000', minHeight: 0, paddingTop: 2, paddingBottom: 2, lineHeight: 1.2 }}>
              {val.replace('-', ' ').replace('increment', 'min increments')}
              </MenuItem>
          ))}
            </TextField>
          </Box>

      {/* Display Options */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: 13, color: '#000', mr: 0.5 }}>Color</Typography>
            <TextField
              type="color"
          value={`#${selectedPoint.color}`}
          onChange={e => onColorChange(e.target.value.replace('#', ''))}
              size="small"
              sx={{ width: 22, minWidth: 22, height: 22, p: 0, border: 0, background: 'none', mr: 1, '& input': { width: 22, height: 22, padding: 0 } }}
              inputProps={{ style: { padding: 0, border: 0, background: 'none', width: 22, height: 22 } }}
            />
            <Typography variant="body2" sx={{ fontSize: 13, color: '#000', ml: 0.5, mr: 0.5 }}>Opacity</Typography>
            <Slider
          value={selectedPoint.polygonOpacity}
              min={0}
              max={100}
          onChange={(_, val) => onPolygonOpacityChange(val as number)}
              sx={{
                width: 100,
                mx: 0.5,
                color: '#888',
            '& .MuiSlider-thumb': { width: 16, height: 16, backgroundColor: '#666', boxShadow: 'none' },
            '& .MuiSlider-track': { color: '#888' },
            '& .MuiSlider-rail': { color: '#ccc' },
              }}
            />
            <TextField
          value={selectedPoint.polygonOpacity}
              onChange={e => {
                let val = Math.max(0, Math.min(100, Number(e.target.value.replace(/[^0-9]/g, ''))));
            onPolygonOpacityChange(val);
              }}
              size="small"
              sx={{ width: 60, ml: 0.5, height: 32, '& .MuiInputBase-root': { height: 32, minHeight: 32, fontSize: 13, padding: '0 2px' } }}
              inputProps={{
                style: { fontSize: 13, height: 32, padding: '0 2px', textAlign: 'right', width: 28 },
                maxLength: 3,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end" sx={{ ml: 0, p: 0, minWidth: 0 }}><span style={{ fontSize: 11, marginLeft: 2, marginRight: 8, padding: 0 }}>%</span></InputAdornment>
              }}
            />
          </Box>
      
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
            <ToggleButtonGroup
          value={selectedPoint.polygonVisible ? 'polygons' : 'lines'}
              exclusive
              onChange={(_, value) => {
            if (value !== null) {
              onDisplayModeChange(value as 'polygons' | 'lines');
                }
              }}
              size="small"
              sx={{ width: '100%' }}
              fullWidth
            >
              <ToggleButton value="polygons" sx={{ px: 1, py: 0.5, fontSize: 13, textTransform: 'none' }} fullWidth>
                Polygons
              </ToggleButton>
              <ToggleButton value="lines" sx={{ px: 1, py: 0.5, fontSize: 13, textTransform: 'none' }} fullWidth>
                Lines
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={pendingDeleteIdx !== null} onClose={() => setPendingDeleteIdx(null)}>
        <DialogTitle>Remove Point?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this point? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDeleteIdx(null)} variant="outlined" sx={{ color: '#444', borderColor: '#bbb', background: '#fff', '&:hover': { borderColor: '#888', background: '#f5f5f5' } }}>Cancel</Button>
          <Button onClick={() => { if (pendingDeleteIdx !== null) { onDeletePoint(pendingDeleteIdx); setPendingDeleteIdx(null); } }} variant="contained" sx={{ color: '#fff', background: '#222', '&:hover': { background: '#444' } }}>Remove</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for max points */}
      <Snackbar
        open={snackbarVisible}
        autoHideDuration={3000}
        onClose={() => setSnackbarVisible(false)}
        message={`Maximum of ${MAX_POINTS} points reached.`}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
};

export default forwardRef(IsochroneControls);