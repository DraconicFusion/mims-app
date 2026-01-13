import { useState } from 'react';

const ReportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'CHECKPOINT',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get user's current location
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const payload = {
        type: formData.type,
        description: formData.description,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      try {
        // FIX: Use the Vercel Environment Variable instead of localhost
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        const response = await fetch(`${apiUrl}/api/v1/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert('Report submitted successfully!');
          setIsOpen(false);
          setFormData({ type: 'CHECKPOINT', description: '' });
          window.location.reload(); 
        } else {
          alert('Failed to submit report.');
        }
      } catch (error) {
        console.error(error);
        alert('Error connecting to server.');
      } finally {
        setLoading(false);
      }
    }, () => {
      alert("Unable to retrieve your location.");
      setLoading(false);
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute',
          // FIX: Move up to avoid mobile address bars and home swipe bars
          bottom: 'calc(30px + env(safe-area-inset-bottom))',
          right: '20px',
          zIndex: 1000,
          padding: '15px 20px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        Report Activity
      </button>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      // FIX: Move form higher so keyboard doesn't cover "Submit"
      bottom: 'calc(100px + env(safe-area-inset-bottom))',
      right: '20px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      width: '300px'
    }}>
      <h3 style={{ marginTop: 0 }}>New Report</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Type:</label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="CHECKPOINT">Checkpoint</option>
            <option value="ICE_ACTIVITY">ICE Activity</option>
            <option value="DETENTION_BUS">Detention Bus</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{ width: '100%', padding: '8px', minHeight: '60px' }}
            placeholder="Describe what you see..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            style={{ flex: 1, padding: '10px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '10px', 
              backgroundColor: '#d32f2f', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportButton;