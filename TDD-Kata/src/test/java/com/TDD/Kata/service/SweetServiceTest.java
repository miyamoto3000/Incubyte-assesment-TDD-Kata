package com.TDD.Kata.service;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.repository.SweetRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SweetServiceTest {

    @Mock private SweetRepository sweetRepository;
    @InjectMocks private SweetService sweetService;

    // 1. ADD SWEET (Already Green)
    @Test
    @DisplayName("Should add a sweet successfully")
    void shouldAddSweetSuccessfully() {
        Sweet sweet = Sweet.builder().name("Fudge").price(BigDecimal.TEN).build();
        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweet);
        
        Sweet result = sweetService.addSweet(sweet);
        assertNotNull(result);
    }

    // 2. GET ALL SWEETS (Red)
    @Test
    @DisplayName("Should return list of all sweets")
    void shouldGetAllSweets() {
        when(sweetRepository.findAll()).thenReturn(List.of(new Sweet(), new Sweet()));
        
        List<Sweet> results = sweetService.getAllSweets();
        
        assertNotNull(results, "Service returned NULL instead of list"); // Will Fail
        assertEquals(2, results.size());
    }

    // 3. GET SWEET BY ID (Red)
    @Test
    @DisplayName("Should return sweet by ID")
    void shouldGetSweetById() {
        Sweet sweet = Sweet.builder().id("123").name("Candy").build();
        when(sweetRepository.findById("123")).thenReturn(Optional.of(sweet));

        Sweet result = sweetService.getSweetById("123");

        assertNotNull(result, "Service returned NULL"); // Will Fail
        assertEquals("Candy", result.getName());
    }

    // 4. UPDATE SWEET (Red)
    @Test
    @DisplayName("Should update existing sweet")
    void shouldUpdateSweet() {
        Sweet existing = Sweet.builder().id("123").name("Old Name").build();
        Sweet updateRequest = Sweet.builder().name("New Name").price(BigDecimal.ONE).build();
        
        when(sweetRepository.findById("123")).thenReturn(Optional.of(existing));
        when(sweetRepository.save(any(Sweet.class))).thenReturn(updateRequest);

        Sweet result = sweetService.updateSweet("123", updateRequest);

        assertNotNull(result, "Service returned NULL"); // Will Fail
        assertEquals("New Name", result.getName());
    }

    // 5. DELETE SWEET (Red)
    @Test
    @DisplayName("Should delete sweet by ID")
    void shouldDeleteSweet() {
        String id = "123";
        // Mock that the ID exists so we can delete it
        when(sweetRepository.existsById(id)).thenReturn(true);

        sweetService.deleteSweet(id);

        verify(sweetRepository).deleteById(id); // Will Fail (Method does nothing)
    }
}