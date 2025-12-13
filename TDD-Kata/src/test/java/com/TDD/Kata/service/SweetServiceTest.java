package com.TDD.Kata.service;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.repository.SweetRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SweetServiceTest {

    @Mock private SweetRepository sweetRepository;
    @Mock private MongoTemplate mongoTemplate; 
    @InjectMocks private SweetService sweetService;


    @Test
    @DisplayName("Should add a sweet successfully")
    void shouldAddSweetSuccessfully() {
        Sweet sweet = Sweet.builder().name("Fudge").price(BigDecimal.TEN).build();
        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweet);
        
        Sweet result = sweetService.addSweet(sweet);
        assertNotNull(result);
    }

    @Test
    @DisplayName("Should return list of all sweets")
    void shouldGetAllSweets() {
        when(sweetRepository.findAll()).thenReturn(List.of(new Sweet(), new Sweet()));
        
        List<Sweet> results = sweetService.getAllSweets();
        
        assertNotNull(results);
        assertEquals(2, results.size());
    }

    @Test
    @DisplayName("Should return sweet by ID")
    void shouldGetSweetById() {
        Sweet sweet = Sweet.builder().id("123").name("Candy").build();
        when(sweetRepository.findById("123")).thenReturn(Optional.of(sweet));

        Sweet result = sweetService.getSweetById("123");

        assertNotNull(result);
        assertEquals("Candy", result.getName());
    }

    @Test
    @DisplayName("Should update existing sweet")
    void shouldUpdateSweet() {
        Sweet existing = Sweet.builder().id("123").name("Old Name").build();
        Sweet updateRequest = Sweet.builder().name("New Name").price(BigDecimal.ONE).build();
        
        when(sweetRepository.findById("123")).thenReturn(Optional.of(existing));
        when(sweetRepository.save(any(Sweet.class))).thenReturn(updateRequest);

        Sweet result = sweetService.updateSweet("123", updateRequest);

        assertNotNull(result);
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

    // ==========================================
    //       NEW EXTENSIVE SEARCH TESTS
    // ==========================================

    @Test
    @DisplayName("Search: Should find by Keyword only (Checks Name OR Category)")
    void shouldSearchByKeywordOnly() {
        // Arrange
        String keyword = "Chocolate";
        when(mongoTemplate.find(any(Query.class), eq(Sweet.class)))
                .thenReturn(List.of(new Sweet()));

        // Act
        sweetService.searchSweets(keyword, null, null);

        // Assert: Capture the Query to inspect it
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(queryCaptor.capture(), eq(Sweet.class));

        Query executedQuery = queryCaptor.getValue();
        String queryString = executedQuery.toString();

        // Verify structure: (Name regex OR Category regex)
        assertTrue(queryString.contains("$or"), "Query should contain '$or' operator");
        assertTrue(queryString.contains("name"), "Query should check 'name' field");
        assertTrue(queryString.contains("category"), "Query should check 'category' field");
        assertTrue(queryString.contains(keyword), "Query should contain the keyword");
    }

    @Test
    @DisplayName("Search: Should filter by Price Range only (Min & Max)")
    void shouldSearchByPriceRangeOnly() {
        // Arrange
        BigDecimal min = BigDecimal.valueOf(10);
        BigDecimal max = BigDecimal.valueOf(50);
        when(mongoTemplate.find(any(Query.class), eq(Sweet.class))).thenReturn(Collections.emptyList());

        // Act
        sweetService.searchSweets(null, min, max);

        // Assert
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(queryCaptor.capture(), eq(Sweet.class));

        String queryString = queryCaptor.getValue().toString();

        // Verify: price >= 10 AND price <= 50
        assertTrue(queryString.contains("price"), "Query should check 'price'");
        assertTrue(queryString.contains("$gte"), "Query should have greater-than-equal");
        assertTrue(queryString.contains("$lte"), "Query should have less-than-equal");
        assertFalse(queryString.contains("$or"), "Query should NOT have '$or' when no keyword is present");
    }

    @Test
    @DisplayName("Search: Should filter by Min Price only")
    void shouldSearchByMinPriceOnly() {
        // Arrange
        BigDecimal min = BigDecimal.valueOf(20);
        when(mongoTemplate.find(any(Query.class), eq(Sweet.class))).thenReturn(Collections.emptyList());

        // Act
        sweetService.searchSweets(null, min, null);

        // Assert
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(queryCaptor.capture(), eq(Sweet.class));
        String queryString = queryCaptor.getValue().toString();

        assertTrue(queryString.contains("$gte"), "Query should have $gte");
        assertFalse(queryString.contains("$lte"), "Query should NOT have $lte");
    }

    @Test
    @DisplayName("Search: Should filter by Max Price only")
    void shouldSearchByMaxPriceOnly() {
        // Arrange
        BigDecimal max = BigDecimal.valueOf(100);
        when(mongoTemplate.find(any(Query.class), eq(Sweet.class))).thenReturn(Collections.emptyList());

        // Act
        sweetService.searchSweets(null, null, max);

        // Assert
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(queryCaptor.capture(), eq(Sweet.class));
        String queryString = queryCaptor.getValue().toString();

        assertTrue(queryString.contains("$lte"), "Query should have $lte");
        assertFalse(queryString.contains("$gte"), "Query should NOT have $gte");
    }

    @Test
    @DisplayName("Search: Should combine Keyword AND Price Filter (Amazon Style)")
    void shouldSearchByKeywordAndPrice() {
        // Arrange
        String keyword = "Ladoo";
        BigDecimal maxPrice = BigDecimal.valueOf(500);
        when(mongoTemplate.find(any(Query.class), eq(Sweet.class))).thenReturn(Collections.emptyList());

        // Act
        sweetService.searchSweets(keyword, null, maxPrice);

        // Assert
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(queryCaptor.capture(), eq(Sweet.class));
        String queryString = queryCaptor.getValue().toString();

        // Verify: (Name OR Category) AND (Price <= 500)
        assertTrue(queryString.contains("$or"), "Should have Keyword OR logic");
        assertTrue(queryString.contains("name"), "Should check Name");
        assertTrue(queryString.contains("price"), "Should check Price");
        assertTrue(queryString.contains("$lte"), "Should check Max Price");
    }

    @Test
    @DisplayName("Search: Should return all sweets (empty query) if no criteria provided")
    void shouldReturnAllWhenNoCriteria() {
        // Arrange
        when(mongoTemplate.find(any(Query.class), eq(Sweet.class))).thenReturn(Collections.emptyList());

        // Act
        sweetService.searchSweets(null, null, null);

        // Assert
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(queryCaptor.capture(), eq(Sweet.class));
        
        Query q = queryCaptor.getValue();
        // A truly empty query in Spring Data Mongo usually has an empty criteria map
        assertTrue(q.getQueryObject().isEmpty(), "Query should be empty when no params provided");
    }
}