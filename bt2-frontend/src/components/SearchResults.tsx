import React from 'react';
import  ArtistCard  from './ArtistCard';

interface SearchResultsProps {
  results: any[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Search Results</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        {results.map((item) => (
          <ArtistCard
            key={item.id}
            name={item.name}
            imageUrl={item.images?.[0]?.url ?? ''}
            genres={item.genres ?? []}
            popularity={item.popularity}
            spotifyUrl={item.external_urls.spotify}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
