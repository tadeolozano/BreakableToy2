import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import TopArtists from '../components/TopArtists';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import TrackCard from '../components/TrackCard';
import PlaylistCard from '../components/PlaylistCard';
import { getTopArtists, searchSpotify, getCurrentUser } from '../services/spotifyApi';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<string>('short_term');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, topArtistsData] = await Promise.all([
          getCurrentUser(),
          getTopArtists(10, timeRange),
        ]);
        setUser(userData);
        setTopArtists(topArtistsData.items);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [timeRange]);


  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults(null);
      return;
    }

    try {
      const data = await searchSpotify(query);
      setSearchResults(data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#121212' }}>
      {/* 🎨 Fondo de imágenes */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          display: 'flex',
          flexWrap: 'wrap',
          opacity: 0.15,
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      >
        {topArtists.map((artist) => (
          <img
            key={artist.id}
            src={artist.images?.[0]?.url}
            alt={artist.name}
            style={{
              width: '20%',
              height: 'auto',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* 🔝 Contenido principal */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          fontFamily: 'sans-serif',
          color: '#fff',
        }}
      >
        {user && (
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/me')}
          >
            <img
              src={user.images?.[0]?.url ?? '/placeholder.png'}
              alt="Profile"
              title={user.display_name}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '2px solid #1db954',
                objectFit: 'cover',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
            />
          </div>
        )}

        <SearchBar onSearch={handleSearch} />
        {!searchResults && (
          <div style={{ marginTop: '2rem' }}>
            <label htmlFor="timeRange" style={{ marginRight: '1rem', fontWeight: 'bold' }}>Time Range:</label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                backgroundColor: '#1c1c1c',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              <option value="short_term">Last 4 Weeks</option>
              <option value="medium_term">Last 6 Months</option>
              <option value="long_term">All Time</option>
            </select>
          </div>
        )}



        {!searchResults && (
          <>
            <h2 style={{ marginTop: '3rem', fontSize: '1.8rem' }}>Your Top 10 Artists</h2>
            <div style={{ marginTop: '1.5rem' }}>
              <TopArtists artists={topArtists} />
            </div>
          </>
        )}

        {searchResults && (
          <>
            <h2 style={{ marginTop: '3rem', fontSize: '1.8rem' }}>Search Results</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '2rem',
                marginTop: '2rem',
              }}
            >
              {/* Artists */}
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Artists</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {searchResults.artists?.items?.map((artist: any) => (
                    <Link to={`/artist/${artist.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={artist.id}>
                      <ArtistCard
                        name={artist.name}
                        imageUrl={artist.images?.[0]?.url ?? null}
                        genres={artist.genres}
                        popularity={artist.popularity}
                        spotifyUrl={artist.external_urls.spotify}
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Albums */}
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Albums</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {searchResults.albums?.items?.map((album: any) => (
                    <Link to={`/album/${album.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={album.id}>
                      <AlbumCard
                        title={album.name}
                        imageUrl={album.images?.[0]?.url ?? ''}
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tracks */}
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Tracks</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {searchResults.tracks?.items?.map((track: any) => (
                    <Link to={`/track/${track.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={track.id}>
                      <TrackCard
                        key={track.id}
                        title={track.name}
                        artist={track.artists?.[0]?.name ?? 'Unknown Artist'}
                        previewUrl={track.preview_url}
                        imageUrl={track.album?.images?.[0]?.url ?? ''}
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Playlists */}
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Playlists</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {searchResults.playlists?.items
                    ?.filter((playlist: any) => playlist && playlist.id)
                    .map((playlist: any) => (
                      <Link to={`/playlist/${playlist.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={playlist.id}>
                        <PlaylistCard
                          key={playlist.id}
                          id={playlist.id}
                          name={playlist.name}
                          imageUrl={playlist.images?.[0]?.url}
                          externalUrl={playlist.external_urls?.spotify}
                        />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
