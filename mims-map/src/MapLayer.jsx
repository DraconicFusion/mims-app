import React from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapLayer.css';
import { countyData, cityData } from './mnData';

// --- Styling Constants ---
const COLORS = {
  highRisk: '#ff3333', // Red for High Cooperation (Sherburne, etc)
  lowRisk: '#33ff33',  // Green for Sanctuary/Non-Cooperation (Hennepin)
  citySafe: '#3388ff', // Blue/Distinct for City Ordinances (Mpls/StP)
  neutral: '#cccccc'   // Grey for unknown/neutral
};

const OPACITY = {
  base: 0.4,
  hover: 0.7,
  border: 1
};

const MapLayer = () => {
  
  // --- 2. Jurisdiction Layer Logic (ADAPTED) ---
  // Now uses the 'riskLevel' property from your mnData.js instead of hardcoded names
  const getCountyStyle = (feature) => {
    // Safety check: ensure properties exist
    const props = feature.properties || {};
    
    let fillColor = COLORS.neutral;

    // Data-Driven Logic:
    if (props.riskLevel === 'high') {
      fillColor = COLORS.highRisk;
    } else if (props.riskLevel === 'low') {
      fillColor = COLORS.lowRisk;
    }

    return {
      fillColor: fillColor,
      weight: 1,
      opacity: 1,
      color: 'white', // White borders between counties
      dashArray: '3',
      fillOpacity: OPACITY.base
    };
  };

  // --- 3. The "Sanctuary" Geofence Logic ---
  const getCityStyle = (feature) => {
    return {
      fillColor: COLORS.citySafe,
      weight: 2,
      opacity: 1,
      color: '#004a9e', // Darker blue border for cities
      fillOpacity: 0.2  // Very light fill so it doesn't totally obscure the county
    };
  };

  // --- Interaction Handlers (ADAPTED) ---
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: OPACITY.hover,
          weight: 3
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        // Check if this is a city or county to reset opacity correctly
        // (Assuming cityData features might have a property 'type': 'city')
        // If your data doesn't have 'type', we fallback to OPACITY.base
        const isCityLayer = feature.properties.riskLevel === undefined; 
        
        layer.setStyle({
          fillOpacity: isCityLayer ? 0.2 : OPACITY.base,
          weight: isCityLayer ? 2 : 1
        });
      }
    });
    
    // Popup Logic
    const props = feature.properties || {};
    const name = props.name || props.Name || "Unknown Area";
    
    // Display different text based on whether it's a City or County
    if (props.riskLevel) {
       // County Popup
       layer.bindPopup(`
        <strong>${name} County</strong><br/>
        Policy: ${props.riskLevel.toUpperCase()} COOPERATION<br/>
        Risk Zone: ${props.riskLevel === 'high' ? '🔴 HIGH' : '🟢 LOW'}
      `);
    } else {
       // City Popup
       layer.bindPopup(`
        <strong>${name}</strong><br/>
        Ordinance: Separation Ordinance Active<br/>
        Status: 🔵 CITY PROTECTION ZONE
      `);
    }
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={[45.5, -94.0]} 
        zoom={7} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        <LayersControl position="topright">
          
          {/* 1. DRAW COUNTIES FIRST (Bottom Layer) */}
          <LayersControl.Overlay checked name="County Risks">
            <GeoJSON 
              data={countyData} 
              style={getCountyStyle} 
              onEachFeature={onEachFeature} 
            />
          </LayersControl.Overlay>

          {/* 2. DRAW CITIES SECOND (Top Layer) - Ensures Blue overlays Red/Green */}
          <LayersControl.Overlay checked name="City Sanctuaries">
            <GeoJSON 
              data={cityData} 
              style={getCityStyle} 
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
      
      <div className="map-legend">
        <div className="legend-item"><span className="dot red"></span> High Risk (Sherburne/Anoka)</div>
        <div className="legend-item"><span className="dot green"></span> Sanctuary Policy (Hennepin)</div>
        <div className="legend-item"><span className="dot blue"></span> City Ordinance (Mpls/StP)</div>
      </div>
    </div>
  );
};

export default MapLayer;