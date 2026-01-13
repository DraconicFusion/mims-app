import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;
// ------------------------

const MapLayer = () => {
  const [incidents, setIncidents] = useState(null);

  useEffect(() => {
    // UPDATED: Uses environment variable for Cloud vs Local switching
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    fetch(`${apiUrl}/api/v1/map/incidents`)
      .then(res => res.json())
      .then(data => {
        console.log("MIMS Data:", data);
        setIncidents(data);
      })
      .catch(err => console.error("Connection Failed:", err));
  }, []);

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(`
        <div style="font-family: sans-serif">
          <h3 style="margin:0; color: #d32f2f;">${feature.properties.type}</h3>
          <p style="margin:5px 0;">${feature.properties.description || 'No description'}</p>
        </div>
      `);
    }
  };

  return (
    <MapContainer 
      center={[44.9537, -93.0900]} // Saint Paul
      zoom={11} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {incidents && (
        <GeoJSON 
          data={incidents} 
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default MapLayer;