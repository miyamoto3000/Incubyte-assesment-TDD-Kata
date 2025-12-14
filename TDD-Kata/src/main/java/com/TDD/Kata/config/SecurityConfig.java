package com.TDD.Kata.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity 
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable CORS by using the configuration defined in corsConfigurationSource()
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Disable CSRF (usually done when using JWT and Stateless sessions)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 3. Configure authorization for requests
            .authorizeHttpRequests(auth -> auth
                
                // CRITICAL FIX 1: Permit all OPTIONS requests globally FIRST to solve CORS preflight issues
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                
                // CRITICAL FIX 2: Explicitly permit all methods for the internal /error path to stop security filter chain processing on redirects
                .requestMatchers("/error").permitAll()
                
                // FIX 3: Allow public access (GET) to all sweets endpoints for browsing (Shop)
                .requestMatchers(HttpMethod.GET, "/api/sweets", "/api/sweets/**").permitAll() 
                
                // ALLOW /api/auth/** for login/register
                .requestMatchers("/api/auth/**").permitAll() 
                
                // All other requests must be authenticated (e.g., POST/PUT/DELETE for admin, POST for purchase)
                .anyRequest().authenticated()
            )
            
            // 4. Set session management to STATELESS (required for JWT)
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 5. Configure Authentication Provider and JWT Filter Chain
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    /**
     * Defines the global CORS configuration source.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // IMPORTANT: Allow your frontend's origin(s). 
        configuration.setAllowedOrigins(List.of("http://localhost:3000","http://localhost:3001"));
        
        // Allow all necessary headers (Authorization, Content-Type, etc.)
        configuration.setAllowedHeaders(List.of("*"));
        
        // Allow the HTTP methods used by the frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Crucial for JWT authentication: allows the browser to send cookies/auth headers
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this CORS configuration to ALL API paths
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}        
        