import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistById } from '../services/spotifyApi';
import TrackCard from '../components/TrackCard';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';
import DashboardButton from '../components/DashboardButton';


const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await getPlaylistById(id!);
        setPlaylist(data);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) return <p style={{ padding: '2rem' }}>Loading playlist...</p>;
  if (!playlist) return <p style={{ padding: '2rem' }}>Playlist not found.</p>;

  return (

    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div
        style={{
          position: 'absolute',
          top: -20,
          left: -20,
          right: -20,
          width: 'calc(100% + 40px)',
          //width: '100%',
          height: 'calc(70vh + 20px)',
          backgroundImage: `url(${playlist.images?.[0]?.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px)',
          zIndex: -1,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
        }}
      />
      <BackButton />
      <DashboardButton />
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <img
          src={playlist.images?.[0]?.url}
          alt={playlist.name}
          style={{ width: '200px', height: '200px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div>
          <h1 style={{ margin: 0 }}>{playlist.name}</h1>
          <p style={{ color: '#666' }}>{playlist.description || 'No description.'}</p>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            By {playlist.owner?.display_name}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            {playlist.tracks?.total} tracks
          </p>
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '0.5rem', color: '#1DB954', textDecoration: 'none', backgroundColor: '#fff', padding: '0.5rem 1rem', borderRadius: '9999px' }}
          >
            ▶ Listen on Spotify
          </a>


        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {playlist.tracks?.items.map((item: any, index: number) => {
          const track = item.track;
          if (!track) return null;

          return (
            <>
              <Link to={`/track/${track.id}`} key={track.id || index} style={{ textDecoration: 'none', color: 'inherit' }}>
                <TrackCard
                  key={track.id || index}
                  title={track.name}
                  artist={track.artists.map((a: any) => a.name).join(', ')}
                  imageUrl={track.album?.images?.[0]?.url ?? ''}
                  previewUrl={track.preview_url}
                />
              </Link>
            </>

          );
        })}
      </div>
    </div>
  );
};

export default PlaylistPage;
