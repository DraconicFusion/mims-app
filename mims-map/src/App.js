import React from 'react';
// 1. IMPORT LEAFLET CSS (Critical for map styling)
import 'leaflet/dist/leaflet.css'; 

// 2. Import the Map Component we are about to create
import MapLayer from './MapLayer'; 

function App() {
  return (
    <div className="App">
      {/* 3. Render the Map */}
      <MapLayer />
    </div>
  );
}

export default App;