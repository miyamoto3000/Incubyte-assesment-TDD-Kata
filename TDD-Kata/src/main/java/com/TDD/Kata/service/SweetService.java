package com.TDD.Kata.service;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.repository.SweetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SweetService {

    private final SweetRepository sweetRepository;

    public Sweet addSweet(Sweet sweet) {
        return sweetRepository.save(sweet);
    }

    public List<Sweet> getAllSweets() {
        return sweetRepository.findAll();
    }

    public Sweet getSweetById(String id) {
        return sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found with id: " + id));
    }

    public Sweet updateSweet(String id, Sweet updatedSweet) {
        Sweet existingSweet = getSweetById(id);
        
    
        if (updatedSweet.getName() != null) existingSweet.setName(updatedSweet.getName());
        if (updatedSweet.getCategory() != null) existingSweet.setCategory(updatedSweet.getCategory());
        if (updatedSweet.getPrice() != null) existingSweet.setPrice(updatedSweet.getPrice());
        if (updatedSweet.getQuantity() != null) existingSweet.setQuantity(updatedSweet.getQuantity());
        return sweetRepository.save(existingSweet);
    }

    public void deleteSweet(String id) {
        if (!sweetRepository.existsById(id)) {
            throw new RuntimeException("Sweet not found with id: " + id);
        }
        sweetRepository.deleteById(id);
    } 

    // ... existing methods ...

public Sweet purchaseSweet(String id, Integer amount) { // <--- Added amount
        Sweet sweet = getSweetById(id); 
        if (amount <= 0) {
            throw new RuntimeException("Purchase amount must be positive");
        }
        if (sweet.getQuantity() < amount) {
            throw new RuntimeException("Not enough stock. Available: " + sweet.getQuantity());
        }
        sweet.setQuantity(sweet.getQuantity() - amount); 
        return sweetRepository.save(sweet);
    }

    public Sweet restockSweet(String id, Integer amount) {
        if (amount <= 0) {
            throw new RuntimeException("Restock amount must be positive");
        }

        Sweet sweet = getSweetById(id);
        sweet.setQuantity(sweet.getQuantity() + amount);
        return sweetRepository.save(sweet);
    } 
    public List<Sweet> searchSweets(String name, String category, 
                                    java.math.BigDecimal minPrice, 
                                    java.math.BigDecimal maxPrice) {
        

        return null;
    }
}