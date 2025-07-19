import React from 'react';

interface ArtistCardProps {
  name: string;
  imageUrl: string;
  genres?: string[];
  popularity?: number;
  spotifyUrl?: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ name, imageUrl, genres = [], popularity }) => {
  return (
    <div
      style={{
        width: 160,
        backgroundColor: '#fafafa',
        borderRadius: '12px',
        padding: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        textAlign: 'center',
        transition: 'transform 0.2s',
        color: '#333',
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <img
        src={imageUrl}
        alt={name}
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '0.75rem',
        }}
      />
      <h4 style={{ margin: '0.25rem 0', fontSize: '1rem' }}>{name}</h4>
      <p style={{ fontSize: '0.75rem', color: '#666' }}>
        {genres.length > 0 ? 'Genres: ' + genres.slice(0, 2).join(', ') : 'Genre'}
      </p>
      <p style={{ fontSize: '0.7rem', color: '#999' }}>Popularity: {popularity}</p>
    </div>
  );
};

export default ArtistCard;
