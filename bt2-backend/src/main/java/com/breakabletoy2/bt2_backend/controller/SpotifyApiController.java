package com.breakabletoy2.bt2_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.breakabletoy2.bt2_backend.service.SpotifyAuthService;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/spotify")
@RequiredArgsConstructor
public class SpotifyApiController {

    private final SpotifyAuthService authService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final Environment env;

    @GetMapping("/me")
    public ResponseEntity<?> getUserInfo(@CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        try {
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> spotifyResponse = restTemplate.exchange(
                    env.getProperty("spotify.api.url") + "/me",
                    HttpMethod.GET,
                    entity,
                    String.class);
            return ResponseEntity.ok(spotifyResponse.getBody());

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccess = (String) newTokens.get("access_token");

                ResponseCookie accessCookie = ResponseCookie.from("access_token", newAccess)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .build();

                response.setHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccess);
                HttpEntity<String> retryEntity = new HttpEntity<>(headers);
                ResponseEntity<String> retryResponse = restTemplate.exchange(
                        env.getProperty("spotify.api.url") + "/me",
                        HttpMethod.GET,
                        retryEntity,
                        String.class);

                return ResponseEntity.ok(retryResponse.getBody());
            } else {
                return ResponseEntity.status(e.getStatusCode()).body("Spotify API error");
            }
        }
    }

    @GetMapping("/me/playlists")
    public ResponseEntity<?> getUserPlaylists(@CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);  

        try {
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> spotifyResponse = restTemplate.exchange(
                    env.getProperty("spotify.api.url") + "/me/playlists",
                    HttpMethod.GET,
                    entity,
                    String.class);
            return ResponseEntity.ok(spotifyResponse.getBody());

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccess = (String) newTokens.get("access_token");

                ResponseCookie accessCookie = ResponseCookie.from("access_token", newAccess)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .build();

                response.setHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccess);
                HttpEntity<String> retryEntity = new HttpEntity<>(headers);
                ResponseEntity<String> retryResponse = restTemplate.exchange(
                        env.getProperty("spotify.api.url") + "/me/playlists",
                        HttpMethod.GET,
                        retryEntity,
                        String.class);

                return ResponseEntity.ok(retryResponse.getBody());
            } else {
                return ResponseEntity.status(e.getStatusCode()).body("Spotify API error");
            }
        }
    }

    @GetMapping("/top/artists")
    public ResponseEntity<?> getTopArtists(@RequestParam("limit") String limit, 
            @RequestParam(value = "time_range", defaultValue = "medium_term") String timeRange,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {

        String url = "https://api.spotify.com/v1/me/top/artists?time_range=" + timeRange + "&limit=" + limit;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving top artists: " + ex.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchSpotify(@RequestParam("q") String query,
            @RequestParam("type") String type,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {
        String url = "https://api.spotify.com/v1/search?q=" + query + "&type=" + type;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error searching Spotify: " + ex.getMessage());
        }
    }

    @GetMapping("/artist/{id}")
    public ResponseEntity<?> getArtistById(@PathVariable String id,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {

        String url = "https://api.spotify.com/v1/artists/" + id;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving artist: " + ex.getMessage());
        }
    }

    @GetMapping("/artist/{id}/top-tracks")
    public ResponseEntity<?> getArtistTopTracks(@PathVariable String id,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {

        String url = "https://api.spotify.com/v1/artists/" + id + "/top-tracks?market=US";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving top tracks: " + ex.getMessage());
        }
    }

    @GetMapping("/artist/{id}/related-artists")
    public ResponseEntity<?> getArtistRelatedArtists(@PathVariable String id,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {
        String url = "https://api.spotify.com/v1/artists/" + id + "/related-artists";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);    

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving related artists: " + ex.getMessage());
        }
    }

    @GetMapping("/artist/{id}/albums")
    public ResponseEntity<?> getAlbumsByArtist(@PathVariable String id,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {
        String url = "https://api.spotify.com/v1/artists/" + id + "/albums?include_groups=album,single,compilation&market=US";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);    

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving albums: " + ex.getMessage());
        }
    }

    //aLBUM
    @GetMapping("/album/{id}")
    public ResponseEntity<?> getAlbumById(@PathVariable String id,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {
        String url = "https://api.spotify.com/v1/albums/" + id; 

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving album: " + ex.getMessage());
        }
    }

    @GetMapping("/playlists/{id}")
    public ResponseEntity<?> getPlaylistById(@PathVariable String id,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {
        String url = "https://api.spotify.com/v1/playlists/" + id;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving playlist: " + ex.getMessage());
        }
    }

    @GetMapping("/me/top/tracks")
    public ResponseEntity<?> getTopTracks(@RequestParam("limit") String limit,
            @RequestParam(value = "time_range") String timeRange,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {
        String url = "https://api.spotify.com/v1/me/top/tracks?time_range=" + timeRange + "&limit=" + limit;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);    

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving top tracks: " + ex.getMessage());
        }
    }

    @GetMapping("/track/{id}")
    public ResponseEntity<?> getTrackById(@PathVariable String id,
            @CookieValue("access_token") String accessToken,
            @CookieValue("refresh_token") String refreshToken,
            HttpServletResponse response) {
        String url = "https://api.spotify.com/v1/tracks/" + id; 
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);    

        try {
            ResponseEntity<Object> result = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return ResponseEntity.ok(result.getBody());
        } catch (HttpClientErrorException.Unauthorized e) {
            try {
                Map<String, Object> newTokens = authService.refreshAccessToken(refreshToken);
                String newAccessToken = (String) newTokens.get("access_token");

                ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

                headers.set("Authorization", "Bearer " + newAccessToken);
                entity = new HttpEntity<>(headers);
                ResponseEntity<Object> retryResult = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
                return ResponseEntity.ok(retryResult.getBody());
            } catch (Exception refreshEx) {
                return ResponseEntity.status(401).body("Unable to refresh token: " + refreshEx.getMessage());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Error retrieving track: " + ex.getMessage());
        }
    }


}
