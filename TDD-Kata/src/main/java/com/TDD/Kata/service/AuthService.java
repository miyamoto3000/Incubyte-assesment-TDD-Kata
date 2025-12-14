package com.TDD.Kata.service;

import com.TDD.Kata.dto.AuthResponse;
import com.TDD.Kata.dto.LoginRequest;
import com.TDD.Kata.dto.RegisterRequest;
import com.TDD.Kata.model.Role;
import com.TDD.Kata.model.User;
import com.TDD.Kata.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap; // <-- Ensure this is imported

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("User already exists");
        }

        
        Role roleToSave = (request.getRole() != null) ? request.getRole() : Role.USER;

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(roleToSave) 
                .build();

        userRepository.save(user);
        
        // FIX: Explicitly add the role claim to the JWT payload
        var claims = new HashMap<String, Object>();
        claims.put("role", user.getRole().name()); // Add role
        
        String jwtToken = jwtService.generateToken(claims, user); // Use overloaded generateToken
        
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // FIX: Explicitly add the role claim to the JWT payload
        var claims = new HashMap<String, Object>();
        claims.put("role", user.getRole().name()); // Add role
        
        String jwtToken = jwtService.generateToken(claims, user); // Use overloaded generateToken

        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}