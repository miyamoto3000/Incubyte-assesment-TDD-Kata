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

    @Test
    @DisplayName("Should delete sweet by ID")
    void shouldDeleteSweet() {
        String id = "123";
      
        when(sweetRepository.existsById(id)).thenReturn(true);

        sweetService.deleteSweet(id);

        verify(sweetRepository).deleteById(id); 
    } 
@Test
    @DisplayName("Should purchase specific amount of sweets")
    void shouldPurchaseSpecificAmount() {
        
        Sweet sweet = Sweet.builder().id("1").name("Candy").quantity(10).build();
        when(sweetRepository.findById("1")).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(any(Sweet.class))).thenAnswer(i -> i.getArguments()[0]);

      
        Sweet result = sweetService.purchaseSweet("1", 4);

        assertEquals(6, result.getQuantity());
    }

    @Test
    @DisplayName("Should fail if purchasing more than available stock")
    void shouldFailIfNotEnoughStock() {
    
        Sweet sweet = Sweet.builder().id("1").name("Candy").quantity(3).build();
        when(sweetRepository.findById("1")).thenReturn(Optional.of(sweet));

        
        Exception ex = assertThrows(RuntimeException.class, () -> sweetService.purchaseSweet("1", 5));
        assertEquals("Not enough stock. Available: 3", ex.getMessage());
    }  

    @Test
    @DisplayName("Should search sweets by Name")
    void shouldSearchByName() {
        
        Sweet sweet = Sweet.builder().name("Chocolate").build();
        when(sweetRepository.findByNameContainingIgnoreCase("choc"))
            .thenReturn(List.of(sweet));

        
        List<Sweet> results = sweetService.searchSweets("choc", null, null, null);

    
        assertEquals(1, results.size());
        assertEquals("Chocolate", results.get(0).getName());
    }

    @Test
    @DisplayName("Should search sweets by Price Range")
    void shouldSearchByPriceRange() {
        
        Sweet sweet = Sweet.builder().name("Cheap Candy").price(BigDecimal.ONE).build();
        when(sweetRepository.findByPriceBetween(BigDecimal.ZERO, BigDecimal.TEN))
            .thenReturn(List.of(sweet));


        List<Sweet> results = sweetService.searchSweets(null, null, BigDecimal.ZERO, BigDecimal.TEN);

        
        assertEquals(1, results.size());
    } 
     
    @Test
    @DisplayName("Should search sweets by Price Range")
    void shouldSearchByPriceRange() {
        // Arrange
        Sweet cheapSweet = Sweet.builder().name("Lollipop").price(BigDecimal.ONE).build();
        when(sweetRepository.findByPriceBetween(BigDecimal.ZERO, BigDecimal.TEN))
            .thenReturn(List.of(cheapSweet));

        // Act (Pass min=0, max=10)
        List<Sweet> results = sweetService.searchSweets(null, null, BigDecimal.ZERO, BigDecimal.TEN);

        // Assert
        assertEquals(1, results.size());
    }
}