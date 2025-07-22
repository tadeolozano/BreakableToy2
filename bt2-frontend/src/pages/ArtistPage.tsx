import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArtist, getArtistTopTracks, getAlbumsByArtist } from '../services/spotifyApi';
import BackButton from '../components/BackButton';
import DashboardButton from '../components/DashboardButton';

const ArtistPage: React.FC = () => {
  const { id } = useParams();
  
  const [artist, setArtist] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    getArtist(id).then(setArtist).catch(console.error);
    getArtistTopTracks(id).then((data) => setTopTracks(data.tracks)).catch(console.error);
    getAlbumsByArtist(id).then((data) => setAlbums(data.items)).catch(console.error);
  }, [id]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  if (!artist) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
  <div style={{ position: 'relative' }}>
    <div
      style={{
        position: 'absolute',
        top: '-20px',
        left: '-20px',
        right: '-20px',
        height: '65vh',
        backgroundImage: `url(${artist.images?.[0]?.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(20px)',
        zIndex: -1,
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
      }}
    />

    <div
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <BackButton />
      <DashboardButton />

      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>{artist.name}</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={artist.images?.[0]?.url}
          alt={artist.name}
          style={{ width: 260, borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
        />
        <div style={{ textAlign: 'center' }}>
          <p><strong>Followers:</strong> {artist.followers.total.toLocaleString()}</p>
          <p><strong>Genres:</strong> {artist.genres.join(', ')}</p>
          <p><strong>Popularity:</strong> {artist.popularity}</p>
          <a
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '0.5rem', color: '#1DB954', textDecoration: 'none', backgroundColor: '#fff', padding: '0.5rem 1rem', borderRadius: '9999px' }}
          >
            ▶ Listen on Spotify
          </a>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem', fontSize: '1.8rem' }}>Popular songs</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '0.5rem' }}>#</th>
            <th style={{ padding: '0.5rem' }}>Image</th>
            <th style={{ padding: '0.5rem' }}>Song Name</th>
            <th style={{ padding: '0.5rem' }}>Popularity</th>
            <th style={{ padding: '0.5rem' }}>Length</th>
          </tr>
        </thead>
        <tbody>
          {topTracks.map((track, index) => (
            <tr key={track.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{index + 1}</td>
              <td style={{ padding: '0.5rem' }}>
                <img src={track.album.images?.[0]?.url} alt={track.name} width={40} style={{ borderRadius: 4 }} />
              </td>
              <td style={{ padding: '0.5rem' }}>
                <Link to={`/track/${track.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {track.name}
                </Link>
              </td>
                <td style={{ padding: '0.5rem' }}>
                <div style={{ width: 100, height: 12, background: '#eee', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div
                  style={{
                    width: `${track.popularity}%`,
                    height: '100%',
                    background: '#1DB954',
                    borderRadius: 6,
                    transition: 'width 0.3s',
                  }}
                  />
                  <span style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 10,
                  color: '#222',
                  fontWeight: 600,
                  }}>
                  {track.popularity}
                  </span>
                </div>
                </td>
              <td style={{ padding: '0.5rem' }}>{formatDuration(track.duration_ms)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '3rem', fontSize: '1.8rem' }}>Discography</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
        {albums.map((album) => (
          <Link to={`/album/${album.id}`} style={{ textDecoration: 'none' }} key={album.id}>
            <div
              style={{
                width: 160,
                textAlign: 'center',
                backgroundColor: '#fafafa',
                borderRadius: 8,
                padding: '0.75rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => ((e.currentTarget.style.transform = 'scale(1.03)'))}
              onMouseOut={(e) => ((e.currentTarget.style.transform = 'scale(1)'))}
            >
              <img
                src={album.images?.[0]?.url}
                alt={album.name}
                width="100%"
                style={{ borderRadius: 6 }}
              />
              <p style={{ margin: '0.5rem 0 0.25rem', fontWeight: 600, color: '#000' }}>{album.name}</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>{album.release_date.split('-')[0]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

};

export default ArtistPage;
