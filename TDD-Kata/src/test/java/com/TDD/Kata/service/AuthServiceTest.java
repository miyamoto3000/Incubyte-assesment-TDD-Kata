package com.TDD.Kata.service;

import com.TDD.Kata.dto.AuthResponse;
import com.TDD.Kata.dto.RegisterRequest;
import com.TDD.Kata.model.Role;
import com.TDD.Kata.model.User;
import com.TDD.Kata.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when; 
import com.TDD.Kata.dto.LoginRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService; 
    @Mock private AuthenticationManager authenticationManager;

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

    @Test
    void shouldLoginUserSuccessfully() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("shahid_it", "securePass123");
        User mockUser = User.builder()
                .username("shahid_it")
                .password("encoded_pass")
                .role(Role.USER)
                .build();

        // Mock AuthenticationManager to succeed
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(mockUser, null));
        
        // Mock DB and JWT
        when(userRepository.findByUsername("shahid_it")).thenReturn(Optional.of(mockUser));
        when(jwtService.generateToken(mockUser)).thenReturn("mock-login-token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response); // Will FAIL here (Red)
        assertEquals("mock-login-token", response.getToken());
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsInvalid() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("shahid_it", "WRONG_PASS");

        // Mock AuthManager to throw exception (simulating Spring Security behavior)
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }

    @Test
    void shouldThrowExceptionWhenUserNotFound() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("unknown_user", "pass");

        // Mock AuthManager to succeed (technically it wouldn't, but let's say it passes auth but fails DB lookup)
        // OR simply mock repository to return empty
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); 
        when(userRepository.findByUsername("unknown_user")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
    }
}