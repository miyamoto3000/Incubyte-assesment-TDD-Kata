package com.TDD.Kata.controller;

import com.TDD.Kata.service.JwtService;
import com.TDD.Kata.service.SweetService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SweetController.class)
// We do NOT add (addFilters = false) here because we WANT to test Security
public class SweetControllerSecurityTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private SweetService sweetService;
    @MockBean private JwtService jwtService;

    @Test
    @DisplayName("DELETE /api/sweets/{id} - Should forbid non-admin users (403)")
    @WithMockUser(username = "regularUser", roles = {"USER"}) 
    void shouldForbidDeleteForStandardUser() throws Exception {
        mockMvc.perform(delete("/api/sweets/1")
                        .with(csrf())) // CSRF token needed for mutating requests in tests
                .andExpect(status().isForbidden()); // Expect 403
    }

    @Test
    @DisplayName("DELETE /api/sweets/{id} - Should allow Admin users (204)")
    @WithMockUser(username = "adminUser", roles = {"ADMIN"})
    void shouldAllowDeleteForAdmin() throws Exception {
        mockMvc.perform(delete("/api/sweets/1")
                        .with(csrf()))
                .andExpect(status().isNoContent()); // Expect 204 (Success)
    }
}