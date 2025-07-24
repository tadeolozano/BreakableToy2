package com.breakabletoy2.bt2_backend.controller;

import com.breakabletoy2.bt2_backend.service.SpotifyAuthService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SpotifyApiController.class)
class SpotifyApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SpotifyAuthService authService;

    @MockBean
    private Environment environment;

    // Reemplazo del RestTemplate que se usa dentro del controller
    private RestTemplate restTemplate;

    @BeforeEach
    void setup() {
        Mockito.when(environment.getProperty("spotify.api.url"))
                .thenReturn("https://api.spotify.com/v1");
    }

    @Test
    void testGetUserInfo_withValidAccessToken_returnsUserInfo() throws Exception {
        // Simula la respuesta de Spotify
        String mockSpotifyResponse = "{ \"id\": \"user123\", \"display_name\": \"Test User\" }";

        SpotifyApiController controller = new SpotifyApiController(authService, environment);
        RestTemplate spyRestTemplate = Mockito.spy(new RestTemplate());
        controller.getClass().getDeclaredField("restTemplate").setAccessible(true);
        controller.getClass().getDeclaredField("restTemplate").set(controller, spyRestTemplate);

        // Forzamos que la llamada al endpoint devuelva la respuesta mock
        Mockito.doReturn(new ResponseEntity<>(mockSpotifyResponse, HttpStatus.OK))
                .when(spyRestTemplate).exchange(
                eq("https://api.spotify.com/v1/me"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(String.class)
        );

        // Simulamos cookies
        mockMvc.perform(get("/api/spotify/me")
                        .cookie(new Cookie("access_token", "valid_token"), new Cookie("refresh_token", "refresh_token")))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"id\":\"user123\",\"display_name\":\"Test User\"}"));
    }
}
