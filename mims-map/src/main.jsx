import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// --- LEAFLET ICON FIX START ---
// This fixes missing marker icons when the app is built for production
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// --- LEAFLET ICON FIX END ---

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)