const BASE_URL = `${import.meta.env.VITE_API_URL}/api/spotify`;

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/me`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function getCurrentUserPlaylists() {
  const res = await fetch(`${BASE_URL}/me/playlists`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch user playlists");
  return res.json();
}

export async function getUserTopSongs(limit: number = 10, timeRange: string) {
  const res = await fetch(`${BASE_URL}/me/top/tracks?time_range=${timeRange}&limit=${limit}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch top songs");
  return res.json();
}

export async function getTrack(id: string) {
  const res = await fetch(`${BASE_URL}/track/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch track");
  return res.json();
}

export const checkAuth = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/spotify/me', {
      credentials: 'include', // usa cookies HttpOnly
    });

    return res.ok; 
  } catch {
    return false;
  }
};

async function fetchWithRetry(input: RequestInfo, init?: RequestInit): Promise<Response> {
  let res = await fetch(input, { ...init, credentials: 'include' });

  if (res.status === 401 || res.status === 400) {
    console.log('[Frontend] Token expirado, intentando refrescar');
    const refreshRes = await fetch('/auth/spotify/token/refresh', {
    method: 'POST',
    credentials: 'include',
});


    if (refreshRes.ok) {
      console.log('[Frontend] Refresh exitoso, reintentando solicitud original');
      //recargar la pagina
      window.location.reload();
      // Reintentar la solicitud original con las nuevas credenciales
    } else {
      //redirigir a la página de login si el refresh falla
      console.error('[Frontend] Refresh fallido, redirigiendo a login');
      window.location.href = '/login';
    }
  }

  return res;
}


export async function getTopArtists(limit: number, time_range: string) {
  const res = await fetchWithRetry(`${BASE_URL}/top/artists?time_range=${time_range}&limit=${limit}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch top artists");
  return res.json();
}

// Funciones para obtener información de un artista
export async function getArtist(id: string) {
  const res = await fetchWithRetry(`${BASE_URL}/artist/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch artist");
  return res.json();
}

export async function getArtistTopTracks(artistId: string) {
  const res = await fetchWithRetry(`${BASE_URL}/artist/${artistId}/top-tracks`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch artist top tracks");
  return res.json();
}



export async function getAlbumsByArtist(artistId: string) {
  const res = await fetchWithRetry(`${BASE_URL}/artist/${artistId}/albums`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch artist albums");
  return res.json();
}

export async function getAlbum(id: string) {
  const res = await fetchWithRetry(`${BASE_URL}/album/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch album");
  return res.json();
}

export async function searchSpotify(query: string, types: string[] = ["track", "artist", "album", "playlist"]) {
  const typeParam = types.join(",");
  const res = await fetchWithRetry(`${BASE_URL}/search?q=${encodeURIComponent(query)}&type=${typeParam}`, {
    credentials: "include",
  });
  console.log("Search URL:", `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=${typeParam}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export const getPlaylistById = async (id: string) => {
  const response = await fetchWithRetry(`${BASE_URL}/playlists/${id}`, { credentials: "include" });
  if (!response.ok) throw new Error('Failed to fetch playlist');
  return await response.json();
};

