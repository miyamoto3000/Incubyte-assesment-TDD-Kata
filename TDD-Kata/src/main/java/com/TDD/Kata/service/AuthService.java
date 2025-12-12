package com.TDD.Kata.service;

import com.TDD.Kata.dto.AuthResponse;
import com.TDD.Kata.dto.RegisterRequest;
import com.TDD.Kata.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
      
        return null; 
    }
}