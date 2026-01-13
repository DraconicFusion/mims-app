import React from 'react';
import MapLayer from './MapLayer';
import ReportButton from './Components/ReportButton';

function App() {
  return (
    // position: 'relative' is required so the absolute positioning 
    // inside ReportButton works correctly relative to this container.
    <div style={{ position: 'relative', height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <MapLayer />
      <ReportButton />
    </div>
  );
}

export default App;