package com.TDD.Kata.repository;

import com.TDD.Kata.model.Sweet;
import org.springframework.data.mongodb.repository.MongoRepository; 
import java.math.BigDecimal;
import java.util.List;

public interface SweetRepository extends MongoRepository<Sweet, String> {
    
    List<Sweet> findByNameContainingIgnoreCase(String name);


    List<Sweet> findByCategoryIgnoreCase(String category);

    
    List<Sweet> findByPriceBetween(BigDecimal min, BigDecimal max);
    
}