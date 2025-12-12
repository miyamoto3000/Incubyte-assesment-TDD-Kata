package com.TDD.Kata.controller;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.service.SweetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; 
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
@RequiredArgsConstructor
public class SweetController {

    private final SweetService sweetService;

    @PostMapping
    public ResponseEntity<Sweet> addSweet(@RequestBody Sweet sweet) {
        return ResponseEntity.ok(sweetService.addSweet(sweet));
    }

    @GetMapping
    public ResponseEntity<List<Sweet>> getAllSweets() {
        return null; 
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sweet> getSweetById(@PathVariable String id) {
        return null; 
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sweet> updateSweet(@PathVariable String id, @RequestBody Sweet sweet) {
        return null; 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSweet(@PathVariable String id) {
        return null; 
    }
}