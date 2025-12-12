package com.TDD.Kata.service;

import com.TDD.Kata.model.User;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    public String generateToken(User user) {
        return "mock-token";
    }
}