package com.TDD.Kata.service;

import com.TDD.Kata.model.Sweet;
import com.TDD.Kata.repository.SweetRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SweetService {

    private final SweetRepository sweetRepository;

   public Sweet addSweet(Sweet sweet) {
        return sweetRepository.save(sweet); // This fixes the failure!
    } 

    public List<Sweet> getAllSweets() {
        return null; 
    }

    public Sweet getSweetById(String id) {
        return null; 
    }

    public Sweet updateSweet(String id, Sweet sweet) {
        return null; 
    }

    public void deleteSweet(String id) {
        
    }
}