import React, { useEffect, useState } from 'react';
import {
  getCurrentUser,
  getCurrentUserPlaylists,
  getTopArtists,
  getUserTopSongs
} from '../services/spotifyApi';
import ArtistCard from '../components/ArtistCard';
import PlaylistCard from '../components/PlaylistCard';
import BackButton from '../components/BackButton';
import { Link } from 'react-router-dom';
import TrackCard from '../components/TrackCard';

const MePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topSongs, setTopSongs] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userData, playlistsData, topArtistsData, topSongsData] = await Promise.all([
          getCurrentUser(),
          getCurrentUserPlaylists(),
          getTopArtists(),
          getUserTopSongs()
        ]);

        setUser(userData);
        setPlaylists(playlistsData.items);
        setTopArtists(topArtistsData.items);
        setTopSongs(topSongsData.items);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading profile...</p>;
  if (!user) return <p style={{ padding: '2rem' }}>User not found.</p>;

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        color: '#111',
      }}
    >
      <div
      style={{
        position: 'absolute',
        top: '-20px',
        left: '-20px',
        right: '-20px',
        height: '65vh',
        backgroundImage: `url(${user.images?.[0]?.url || '/placeholder.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(20px)',
        zIndex: -1,
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
      }}
    />
      <BackButton />

      {/* User Info */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        <img
          src={user.images?.[0]?.url ?? '/placeholder.png'}
          alt={user.display_name}
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        />
        <h1 style={{ marginTop: '1rem', fontSize: '2rem' }}>{user.display_name}</h1>
        {user.email && <p style={{ color: '#555' }}>{user.email}</p>}
        <p style={{ color: '#777' }}>
          Followers: {user.followers?.total.toLocaleString()} • Country: {user.country}
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <a
            href={user.external_urls?.spotify}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#1db954',
              textDecoration: 'none',
              fontWeight: 600,
              backgroundColor: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            View on Spotify ↗
          </a>
        </p>
      </div>

      {/* Top Songs */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Your Top Songs</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
          }}
        >
          {topSongs.map((song: any) => (
            <Link
              to={`/track/${song.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              key={song.id}
            >
              <TrackCard
                key={song.id}
                title={song.name}
                artist={song.artists?.map((a: any) => a.name).join(', ')}
                imageUrl={song.album?.images?.[0]?.url ?? ''}
                previewUrl={song.preview_url}
              />

            </Link>
          ))}
        </div>
      </section>

      {/* Top Artists */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Your Top Artists</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
          }}
        >
          {topArtists.map((artist: any) => (
            <Link
              to={`/artist/${artist.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              key={artist.id}
            >
              <ArtistCard
                key={artist.id}
                name={artist.name}
                imageUrl={artist.images?.[0]?.url}
                genres={artist.genres}
                popularity={artist.popularity}
                spotifyUrl={artist.external_urls.spotify}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Playlists */}
      <section>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Your Playlists</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
          }}
        >
          {playlists.map((playlist: any) => (
            <Link
              to={`/playlist/${playlist.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              key={playlist.id}
            >
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
      </section>
    </div>
  );
};

export default MePage;
