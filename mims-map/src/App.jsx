import React from 'react';
import MapLayer from './MapLayer';
import ReportButton from './Components/ReportButton';

function App() {
  return (
    <div style={{ 
      position: 'relative', 
      height: '100dvh',   // <--- Crucial for mobile!
      width: '100vw', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden'  // <--- Stops the page from bouncing
    }}>
      <MapLayer />
      <ReportButton />
    </div>
  );
}

export default App;