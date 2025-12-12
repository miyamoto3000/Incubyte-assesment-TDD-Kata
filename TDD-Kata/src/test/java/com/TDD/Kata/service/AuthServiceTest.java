package com.TDD.Kata.service;

import com.TDD.Kata.dto.AuthResponse;
import com.TDD.Kata.dto.RegisterRequest;
import com.TDD.Kata.model.User;
import com.TDD.Kata.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() {
      
        RegisterRequest request = new RegisterRequest("shahid_it", "securePass123");
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(new User());
        when(jwtService.generateToken(any(User.class))).thenReturn("mock-token");

        AuthResponse response = authService.register(request);

       
        assertNotNull(response); 
    }
}