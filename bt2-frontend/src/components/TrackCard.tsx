import React from 'react';

interface TrackCardProps {
  title: string;
  artist: string;
  imageUrl: string;
  previewUrl?: string;
}

const TrackCard: React.FC<TrackCardProps> = ({ title, artist, imageUrl, previewUrl }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: '#fafafa',
        borderRadius: '12px',
        //padding: '0.75rem',
        paddingRight: '0.75rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
        color: '#333',
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{ width: 70, height: 70, borderBottomLeftRadius: '8px', borderTopLeftRadius: '8px', objectFit: 'cover' }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{title}</p>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{artist}</p>
      </div>
      {previewUrl && (
        <audio controls src={previewUrl} style={{ width: 120 }} />
      )}
    </div>
  );
};

export default TrackCard;
