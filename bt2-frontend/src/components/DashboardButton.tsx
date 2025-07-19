import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/dashboard')}
      style={{
        marginBottom: '2rem',
        
        padding: '0.5rem 1.5rem',
        background: 'linear-gradient(90deg, #1db954 0%, #1ed760 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '24px',
        fontWeight: 600,
        fontSize: '1rem',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(30, 217, 96, 0.15)',
        transition: 'all 0.2s ease-in-out',
      }}
      onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.05)')}
      onMouseOut={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
    >
      ⬅ Dashboard
    </button>
  );
};

export default DashboardButton;
