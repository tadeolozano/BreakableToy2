import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTrack, getArtist, getAlbum } from '../services/spotifyApi';
import BackButton from '../components/BackButton';
import ArtistCard from '../components/ArtistCard';
import DashboardButton from '../components/DashboardButton';

const TrackPage = () => {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<any>(null);
  const [artists, setArtists] = useState<any[]>([]);
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const trackData = await getTrack(id!);
        setTrack(trackData);

        const albumData = await getAlbum(trackData.album.id);
        setAlbum(albumData);

        const artistData = await Promise.all(
          trackData.artists.map((artist: any) => getArtist(artist.id))
        );
        setArtists(artistData);
      } catch (err) {
        console.error('Error fetching track data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [id]);

  if (loading) return <p style={{ padding: '2rem' }}>Loading track...</p>;
  if (!track) return <p style={{ padding: '2rem' }}>Track not found.</p>;

  return (
    <div
      style={{
        position: 'relative',
        padding: '2rem',
        alignItems: 'center',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        color: '#111',
      }}
    >

      <div
        style={{
          position: 'absolute',
          top: -20,
          left: -20,
          right: -20,
          width: 'calc(100% + 40px)',
          //width: '100%',
          height: 'calc(70vh + 20px)',
          backgroundImage: `url(${track.album.images?.[0]?.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px)',
          zIndex: -1,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
          maxWidth: '100vw', overflowX: 'hidden'
        }}
      />

      <BackButton />
      <DashboardButton />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '3rem',
          textAlign: 'center',
        }}
      >
        <img
          src={track.album.images?.[0]?.url}
          alt={track.name}
          style={{
            width: 300,
            height: 300,
            objectFit: 'cover',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        />
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{track.name}</h1>
          <p style={{ color: '#555', marginBottom: '0.5rem' }}>
            Duration: {Math.floor(track.duration_ms / 60000)}:
            {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')} min
          </p>
          <p style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
            <strong>Album:</strong>{' '}
            <Link
              to={`/album/${album?.id}`}
              style={{
                color: '#1db954',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {album?.name}
            </Link>
          </p>
          <div style={{ marginTop: '1rem' }}>
            <iframe
              style={{ borderRadius: '12px' }}
              src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&autoplay=true&theme=1`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>


      {/* Artists */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>Artists</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
          }}
        >
          {artists.map((artist) => (
            <Link
              to={`/artist/${artist.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              key={artist.id}
            >
              <ArtistCard
                name={artist.name}
                imageUrl={artist.images?.[0]?.url}
                genres={artist.genres}
                popularity={artist.popularity}
                spotifyUrl={artist.external_urls?.spotify}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrackPage;
