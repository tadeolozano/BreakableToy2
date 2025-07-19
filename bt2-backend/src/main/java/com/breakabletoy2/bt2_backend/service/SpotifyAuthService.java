package com.breakabletoy2.bt2_backend.service;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SpotifyAuthService {

    private final Environment env;
    private final RestTemplate restTemplate = new RestTemplate();

    public URI buildAuthorizationUri() {
        String clientId = env.getProperty("spotify.client.id");
        String redirectUri = env.getProperty("spotify.redirect.uri");

        return UriComponentsBuilder.fromHttpUrl(env.getProperty("spotify.auth.url"))
                .queryParam("client_id", clientId)
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", redirectUri)
                .queryParam("scope",
                        "user-read-private user-read-email user-top-read user-library-read user-read-playback-state")
                .build()
                .toUri();
    }

    public Map<String, Object> exchangeCodeForToken(String code) {
        String clientId = env.getProperty("spotify.client.id");
        String clientSecret = env.getProperty("spotify.client.secret");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        String auth = clientId + ":" + clientSecret;
        headers.set("Authorization",
                "Basic " + Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8)));

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("code", code);
        form.add("redirect_uri", env.getProperty("spotify.redirect.uri"));

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(form, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(env.getProperty("spotify.token.url"), entity,
                Map.class);
        return response.getBody();
    }

    public Map<String, Object> refreshAccessToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            System.out.println("[AuthService] No refresh token available.");
            return Map.of();
        }

        System.out.println("[AuthService] Access token expired. Refreshing...");
        System.out.println("[AuthService] Using refresh_token = " + refreshToken);

        String clientId = env.getProperty("spotify.client.id");
        String clientSecret = env.getProperty("spotify.client.secret");
        String tokenUrl = env.getProperty("spotify.token.url");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String auth = clientId + ":" + clientSecret;
        String basicAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + basicAuth);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "refresh_token");
        form.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(form, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, entity, Map.class);
            Map<String, Object> body = response.getBody();

            if (body == null || !body.containsKey("access_token")) {
                System.out.println("[AuthService] Refresh response missing access_token: " + body);
                return Map.of(); // mapa vacío indica error
            }

            System.out.println("[AuthService] New access_token received: " + body.get("access_token"));
            return body;

        } catch (Exception e) {
            System.out.println("[AuthService] Error refreshing token: " + e.getMessage());
            return Map.of(); // mapa vacío para forzar 401 si el refresh falló
        }
    }

}
