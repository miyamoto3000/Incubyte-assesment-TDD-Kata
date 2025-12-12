package com.TDD.Kata.repository;

import com.TDD.Kata.model.Sweet;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SweetRepository extends MongoRepository<Sweet, String> {
     
    
}