import React from 'react';
import MapLayer from './MapLayer';
import ReportButton from './components/ReportButton';

function App() {
  return (
    <div style={{ 
      position: 'relative', 
      height: '100dvh', // Changed from 100vh to 100dvh (Dynamic Viewport Height)
      width: '100vw', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden' // Prevents scrolling so the map stays fixed
    }}>
      <MapLayer />
      <ReportButton />
    </div>
  );
}

export default App;