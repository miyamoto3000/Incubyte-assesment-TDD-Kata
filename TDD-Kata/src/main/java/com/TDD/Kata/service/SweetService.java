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
        
        // Update fields
        existingSweet.setName(updatedSweet.getName());
        existingSweet.setCategory(updatedSweet.getCategory());
        existingSweet.setPrice(updatedSweet.getPrice());
        existingSweet.setQuantity(updatedSweet.getQuantity());
        
        return sweetRepository.save(existingSweet);
    }

    public void deleteSweet(String id) {
        if (!sweetRepository.existsById(id)) {
            throw new RuntimeException("Sweet not found with id: " + id);
        }
        sweetRepository.deleteById(id);
    }
}