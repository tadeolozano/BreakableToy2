import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAlbum } from '../services/spotifyApi';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';
import DashboardButton from '../components/DashboardButton';

const AlbumPage: React.FC = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getAlbum(id).then(setAlbum).catch(console.error);
  }, [id]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    if (!album?.tracks?.items) return '0:00';
    const totalMs = album.tracks.items.reduce((sum: number, track: any) => sum + track.duration_ms, 0);
    return formatDuration(totalMs);
  };

  if (!album) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
  <div style={{ position: 'relative', maxWidth: '100vw', overflowX: 'hidden' }}>
    <div
      style={{
        position: 'absolute',
        top: '-20px',
        left: '-20px',
        right: '-20px',
        height: '60vh',
        
        backgroundImage: `url(${album.images?.[0]?.url})`,
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
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <BackButton />
      <DashboardButton />

      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>{album.name}</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={album.images?.[0]?.url}
          alt={album.name}
          style={{ width: 260, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        />

        <div style={{ textAlign: 'center' }}>
          <p><strong>Release Year:</strong> {album.release_date?.split('-')[0]}</p>
          <p><strong>Total Songs:</strong> {album.total_tracks}</p>
          <p><strong>Total Duration:</strong> {getTotalDuration()}</p>
          <p><strong>Artists:</strong> {album.artists?.map((a: any) => a.name).join(', ')}</p>
          <a
            href={album.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '0.5rem', color: '#1DB954', textDecoration: 'none', backgroundColor: '#fff', padding: '0.5rem 1rem', borderRadius: '9999px' }}
          >
            ▶ Listen on Spotify
          </a>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem', fontSize: '1.8rem' }}>Album songs</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '0.5rem' }}>#</th>
            <th style={{ padding: '0.5rem' }}>Song Name</th>
            <th style={{ padding: '0.5rem' }}>Artist</th>
            <th style={{ padding: '0.5rem' }}>Song Length</th>
          </tr>
        </thead>
        <tbody>
          {album.tracks.items.map((track: any, index: number) => (
            <tr key={track.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{index + 1}</td>
              <td style={{ padding: '0.5rem' }}>
                <Link to={`/track/${track.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {track.name}
                </Link>
              </td>
              <td style={{ padding: '0.5rem' }}>
                {track.artists.map((artist: any, i: number) => (
                  <span key={artist.id}>
                    <Link to={`/artist/${artist.id}`} style={{ color: '#1DB954', textDecoration: 'none' }}>
                      {artist.name}
                    </Link>
                    {i < track.artists.length - 1 && ', '}
                  </span>
                ))}
              </td>
              <td style={{ padding: '0.5rem' }}>{formatDuration(track.duration_ms)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

};

export default AlbumPage;
