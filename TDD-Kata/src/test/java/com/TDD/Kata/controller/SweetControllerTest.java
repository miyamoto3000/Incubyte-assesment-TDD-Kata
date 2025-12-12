package com.TDD.Kata.controller;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.service.JwtService;
import com.TDD.Kata.service.SweetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SweetController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypass Security filters for Unit Test speed
public class SweetControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private SweetService sweetService;
    @MockBean private JwtService jwtService; // Needed because SecurityConfig loads it
    @Autowired private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/sweets - Should return list")
    void shouldReturnAllSweets() throws Exception {
        when(sweetService.getAllSweets()).thenReturn(List.of(
                Sweet.builder().name("Sweet 1").build(),
                Sweet.builder().name("Sweet 2").build()
        ));

        mockMvc.perform(get("/api/sweets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("PUT /api/sweets/{id} - Should update sweet")
    void shouldUpdateSweet() throws Exception {
        Sweet updateData = Sweet.builder().name("Updated").price(BigDecimal.TEN).build();
        when(sweetService.updateSweet(eq("1"), any(Sweet.class))).thenReturn(updateData);

        mockMvc.perform(put("/api/sweets/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"));
    }

    @Test
    @DisplayName("DELETE /api/sweets/{id} - Should delete sweet")
    void shouldDeleteSweet() throws Exception {
        mockMvc.perform(delete("/api/sweets/1"))
                .andExpect(status().isNoContent()); // Expects 204

        verify(sweetService).deleteSweet("1");
    }
}