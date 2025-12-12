package com.TDD.Kata.service;

import com.TDD.Kata.dto.AuthResponse;
import com.TDD.Kata.dto.LoginRequest;
import com.TDD.Kata.dto.RegisterRequest;
import com.TDD.Kata.model.Role;
import com.TDD.Kata.model.User;
import com.TDD.Kata.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    // --- REGISTRATION TESTS ---

    @Test
    @DisplayName("Should register a standard USER successfully")
    void shouldRegisterUserSuccessfully() {
        // Arrange
        RegisterRequest request = new RegisterRequest("standard_user", "pass123", Role.USER);
        
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(new User()); // Mock save
        when(jwtService.generateToken(any(User.class))).thenReturn("mock-jwt-token");

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());

        // Verify correct role was saved
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals(Role.USER, userCaptor.getValue().getRole());
    }

    @Test
    @DisplayName("Should register an ADMIN successfully (RBAC Check)")
    void shouldRegisterAdminUserSuccessfully() {
        // Arrange
        RegisterRequest request = new RegisterRequest("admin_user", "adminPass", Role.ADMIN);
        
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(new User());
        when(jwtService.generateToken(any(User.class))).thenReturn("mock-admin-token");

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        
        // Verify we saved a user with ADMIN role
        verify(userRepository).save(argThat(user -> user.getRole() == Role.ADMIN));
    }

    @Test
    @DisplayName("Should default to USER role if role is NULL (Safety Net)")
    void shouldRegisterUserWithDefaultRoleWhenRoleIsNull() {
        // Arrange: Role is explicitly NULL
        RegisterRequest request = new RegisterRequest("default_user", "password", null);
        
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(new User());
        when(jwtService.generateToken(any(User.class))).thenReturn("mock-token");

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        
        // CRITICAL: Verify it defaulted to USER
        verify(userRepository).save(argThat(user -> user.getRole() == Role.USER));
    }

    @Test
    @DisplayName("Should fail registration if Username already exists")
    void shouldThrowExceptionWhenUserAlreadyExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest("existing_user", "password", Role.USER);
        when(userRepository.existsByUsername(request.getUsername())).thenReturn(true);

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("User already exists", exception.getMessage());
        
        // Verify we never tried to save
        verify(userRepository, never()).save(any(User.class));
    }

    // --- LOGIN TESTS ---

    @Test
    @DisplayName("Should Login successfully and return Token")
    void shouldLoginUserSuccessfully() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("valid_user", "securePass");
        User mockUser = User.builder()
                .username("valid_user")
                .role(Role.USER)
                .build();

        // Mock Auth Manager Success
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(mockUser, null));
        
        // Mock DB Finding User
        when(userRepository.findByUsername("valid_user")).thenReturn(Optional.of(mockUser));
        
        // Mock Token Generation
        when(jwtService.generateToken(mockUser)).thenReturn("valid-token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("valid-token", response.getToken());
    }

    @Test
    @DisplayName("Should fail Login on Bad Credentials (Wrong Password)")
    void shouldThrowExceptionWhenPasswordIsInvalid() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("valid_user", "WRONG_PASS");

        // Simulate Spring Security throwing BadCredentialsException
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
        
        // Ensure we didn't generate a token
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    @DisplayName("Should fail Login if User Not Found in DB (Data Integrity Check)")
    void shouldThrowExceptionWhenUserNotFound() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest("ghost_user", "pass");

        // Auth manager might pass (if mocked loosely) or we just test the DB lookup part
        // Let's assume AuthManager returns null or we mock the repository directly for the second step
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); // Auth passes or is bypassed
        
        when(userRepository.findByUsername("ghost_user")).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
        assertEquals("User not found", exception.getMessage());
    }
}