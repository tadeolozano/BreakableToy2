import React from 'react';
import  ArtistCard  from './ArtistCard'; 
import { Link } from 'react-router-dom';

interface TopArtistsProps {
  artists: any[];
}

const TopArtists: React.FC<TopArtistsProps> = ({ artists }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
      {artists.map((artist) => (
        <Link to={`/artist/${artist.id}`} style={{ textDecoration: 'none', color: 'inherit'}} key={artist.id}>
        <ArtistCard
          key={artist.id}
          name={artist.name}
          imageUrl={artist.images?.[0]?.url ?? ''}
          genres={artist.genres}
          popularity={artist.popularity}
          spotifyUrl={artist.external_urls.spotify}

        />
        </Link>
      ))}
    </div>
  );
};

export default TopArtists;
