package com.TDD.Kata.controller;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.service.SweetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; 
import org.springframework.security.access.prepost.PreAuthorize; 
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
@RequiredArgsConstructor
public class SweetController {

    private final SweetService sweetService;

   @PostMapping
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<Sweet> addSweet(@RequestBody @Valid Sweet sweet) {
        return ResponseEntity.ok(sweetService.addSweet(sweet));
    }

    @GetMapping
    public ResponseEntity<List<Sweet>> getAllSweets() {
        return ResponseEntity.ok(sweetService.getAllSweets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sweet> getSweetById(@PathVariable String id) {
        return ResponseEntity.ok(sweetService.getSweetById(id));
    }

   @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Sweet> updateSweet(@PathVariable String id, @RequestBody @Valid Sweet sweet) {
        return ResponseEntity.ok(sweetService.updateSweet(id, sweet));
    }

   @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // <--- CRITICAL: Locks the door
    public ResponseEntity<Void> deleteSweet(@PathVariable String id) {
        sweetService.deleteSweet(id);
        return ResponseEntity.noContent().build();
    } 

  @PostMapping("/{id}/purchase")
    public ResponseEntity<Sweet> purchaseSweet(
            @PathVariable String id, 
            @RequestParam(defaultValue = "1") Integer amount
    ) {
        return ResponseEntity.ok(sweetService.purchaseSweet(id, amount));
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    
    public ResponseEntity<Sweet> restockSweet(@PathVariable String id, @RequestBody Integer amount) {
        return ResponseEntity.ok(sweetService.restockSweet(id, amount));
    } 

    // In SweetController.java

    @GetMapping("/search")
    public ResponseEntity<List<Sweet>> searchSweets(
            @RequestParam(required = false) String keyword,   // The Search Bar
            @RequestParam(required = false) java.math.BigDecimal minPrice, // Filter
            @RequestParam(required = false) java.math.BigDecimal maxPrice  // Filter
    ) {
        return ResponseEntity.ok(sweetService.searchSweets(keyword, minPrice, maxPrice));
    }
}