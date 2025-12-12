package com.TDD.Kata.service;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.repository.SweetRepository; // Will be Red
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService; // Will be Red

    @Test
    void shouldAddSweetSuccessfully() {
        // Arrange
        Sweet sweetToAdd = Sweet.builder()
                .name("Chocolate Fudge")
                .category("Fudge")
                .price(BigDecimal.valueOf(2.50))
                .quantity(100)
                .build();

        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweetToAdd);

        // Act
        Sweet savedSweet = sweetService.addSweet(sweetToAdd);

        // Assert
        assertNotNull(savedSweet);
        assertEquals("Chocolate Fudge", savedSweet.getName());
        verify(sweetRepository).save(any(Sweet.class));
    }
}