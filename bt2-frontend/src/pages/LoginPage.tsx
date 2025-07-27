import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";


export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [loading, isAuthenticated]);

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:8080/auth/spotify/login";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="text-xl font-medium">Checking session...</p>
      </div>
    );

  return (
    <div
    className="bg-pan-right"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        padding: "2rem",
        color: "#fff",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
        }}
      >

        

        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", color: "#000" }}>
          Welcome to <span style={{ color: "#1db954" }}>Spark Tunes</span>
        </h1>

        <p style={{ color: "#111", fontSize: "1rem", marginBottom: "2rem" }}>
          Dive into your top artists, albums and tracks.
        </p>

        <button
          onClick={handleLogin}
          style={{
            backgroundColor: "#1db954",
            color: "#000",
            fontWeight: "bold",
            padding: "0.75rem 2rem",
            borderRadius: "9999px",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            transition: "background 0.2s ease",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1ed760";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1db954";
          }}
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
}
