import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import ArtistPage from "./pages/ArtistPage";
import AlbumPage from "./pages/AlbumPage";
import PlaylistPage from "./pages/PlaylistPage";
import MePage from "./pages/MePage";
import TrackPage from "./pages/TrackPage";

function App() {
  // const { isAuthenticated, loading } = useAuth();

  // if (loading) return <p>Loading session...</p>;

  return (

    <BrowserRouter>
      <Routes>
        
        {/* <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} /> */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/me" element={<MePage />} />
        
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/track/:id" element={<TrackPage />} />
        {/* Redirigir a /dashboard si la ruta no existe */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />}/>
      </Routes>

    </BrowserRouter>

  );
}

export default App;
