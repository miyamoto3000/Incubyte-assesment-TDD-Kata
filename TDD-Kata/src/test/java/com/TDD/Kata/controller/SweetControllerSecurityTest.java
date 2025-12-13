package com.TDD.Kata.controller;

import com.TDD.Kata.config.JwtAuthenticationFilter;
import com.TDD.Kata.config.SecurityConfig;
import com.TDD.Kata.service.SweetService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SweetController.class)
@Import(SecurityConfig.class)
public class SweetControllerSecurityTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private SweetService sweetService;
    @MockBean private JwtAuthenticationFilter jwtAuthenticationFilter;
    @MockBean private AuthenticationProvider authenticationProvider;

    @BeforeEach
    void setUp() throws ServletException, IOException {
        // Fix: Stub the mocked filter to continue the filter chain
        // Otherwise, the request stops here and returns 200 OK without hitting the controller
        doAnswer(invocation -> {
            HttpServletRequest request = invocation.getArgument(0);
            HttpServletResponse response = invocation.getArgument(1);
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());
    }

    @Test
    @DisplayName("DELETE /api/sweets/{id} - Should forbid non-admin users (403)")
    @WithMockUser(username = "regularUser", roles = {"USER"})
    void shouldForbidDeleteForStandardUser() throws Exception {
        mockMvc.perform(delete("/api/sweets/1")
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELETE /api/sweets/{id} - Should allow Admin users (204)")
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void shouldAllowDeleteForAdmin() throws Exception {
        mockMvc.perform(delete("/api/sweets/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }
}