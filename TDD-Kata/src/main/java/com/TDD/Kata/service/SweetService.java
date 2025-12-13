package com.TDD.Kata.service;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.repository.SweetRepository;
import lombok.RequiredArgsConstructor; 
import org.springframework.data.mongodb.core.MongoTemplate; 
import org.springframework.data.mongodb.core.query.Criteria; 
import org.springframework.data.mongodb.core.query.Query;    
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SweetService {

    private final SweetRepository sweetRepository; 
    private final MongoTemplate mongoTemplate;

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
    public List<Sweet> searchSweets(String keyword, 
                                    BigDecimal minPrice, 
                                    BigDecimal maxPrice) {
        
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // 1. "Search Bar" Logic (Keyword matches Name OR Category)
        if (keyword != null && !keyword.isBlank()) {
            Criteria nameMatch = Criteria.where("name").regex(keyword, "i");
            Criteria categoryMatch = Criteria.where("category").regex(keyword, "i");
            
            // This creates the logic: (name LIKE keyword OR category LIKE keyword)
            criteriaList.add(new Criteria().orOperator(nameMatch, categoryMatch));
        }

        // 2. "Sidebar Filter" Logic (Price Range)
        if (minPrice != null || maxPrice != null) {
            Criteria priceCriteria = Criteria.where("price");
            if (minPrice != null) {
                priceCriteria.gte(minPrice); // Greater than or equal
            }
            if (maxPrice != null) {
                priceCriteria.lte(maxPrice); // Less than or equal
            }
            criteriaList.add(priceCriteria);
        }

        // 3. Combine them with "AND"
        // Final Query: (Name OR Category) AND (Price Range)
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Sweet.class);
    }

}