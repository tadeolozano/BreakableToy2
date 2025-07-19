package com.breakabletoy2.bt2_backend;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.*;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Base64;

@Component
public class SpotifyTokenStore {

    private static final String COOKIE_NAME = "spotify_token";

    /**
     * Representa un token guardado
     */
    @Getter
    @AllArgsConstructor
    public static class Token {
        private final String accessToken;
        private final String refreshToken;
        private final Instant expiresAt;
    }

    /**
     * Guarda el token como una cookie HttpOnly codificada en Base64
     */
    public void storeTokenInResponse(Token token, HttpServletResponse response) {
        String raw = token.accessToken + "|" + token.refreshToken + "|" + token.expiresAt.toEpochMilli();
        String encoded = Base64.getEncoder().encodeToString(raw.getBytes());

        Cookie cookie = new Cookie(COOKIE_NAME, encoded);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // usa HTTPS en producción
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7); // 7 días

        response.addCookie(cookie);
    }

    /**
     * Obtiene el token desde la cookie del request
     */
    public Token getTokenFromRequest(HttpServletRequest request) {
        if (request.getCookies() == null)
            return null;

        for (Cookie cookie : request.getCookies()) {
            if (COOKIE_NAME.equals(cookie.getName())) {
                try {
                    String decoded = new String(Base64.getDecoder().decode(cookie.getValue()));
                    String[] parts = decoded.split("\\|");

                    if (parts.length != 3)
                        return null;

                    String accessToken = parts[0];
                    String refreshToken = parts[1];
                    Instant expiresAt = Instant.ofEpochMilli(Long.parseLong(parts[2]));

                    return new Token(accessToken, refreshToken, expiresAt);
                } catch (Exception e) {
                    System.out.println("[TokenStore] Failed to parse token: " + e.getMessage());
                    return null;
                }
            }
        }

        return null;
    }

    /**
     * Limpia la cookie (por ejemplo, al cerrar sesión)
     */
    public void clearToken(HttpServletResponse response) {
        Cookie cookie = new Cookie(COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expira inmediatamente

        response.addCookie(cookie);
    }
}