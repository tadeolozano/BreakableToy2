package com.breakabletoy2.bt2_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/spotify/**", "/api/spotify/**", "/auth/spotify/token/**").permitAll()
                .anyRequest().permitAll()
            )
            .oauth2Login().disable()
            .formLogin().disable()
            .httpBasic().disable();

        return http.build();
    }
}

