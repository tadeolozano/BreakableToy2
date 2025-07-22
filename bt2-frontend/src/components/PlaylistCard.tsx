import React from 'react';

interface PlaylistCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  externalUrl?: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ name, imageUrl }) => {
  return (
    
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          width: '200px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          color: '#333',
          height: '100%',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)' )}
      >
        <img
          src={imageUrl || '/placeholder.png'}
          alt={name}
          style={{
            width: '100%',
            height: '180px',
            borderRadius: '8px',
            objectFit: 'cover',
            marginBottom: '0.75rem',
          }}
        />
        <p style={{ margin: 0, fontWeight: 600, textAlign: 'center' }}>{name}</p>
      </div>
    
  );
};

export default PlaylistCard;
