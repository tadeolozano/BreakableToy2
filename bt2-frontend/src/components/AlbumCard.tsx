import React from 'react';

interface AlbumCardProps {
  title: string;
  imageUrl: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ title, imageUrl }) => {
  return (
    <div
      style={{
        width: 160,
        backgroundColor: '#fafafa',
        borderRadius: '12px',
        padding: '0.75rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        textAlign: 'center',
        transition: 'transform 0.2s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{
          width: '100%',
          height: 160,
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '0.5rem',
        }}
      />
      <p
        style={{
          margin: '0.25rem 0',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: '#1D1D1D',
          lineHeight: '1.1',
        }}
      >
        {title}
      </p>
    </div>
  );
};

export default AlbumCard;
