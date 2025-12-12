package com.TDD.Kata.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sweets")
public class Sweet {
    @Id
    private String id;
    private String name;
    private String category;
    private BigDecimal price;
    private Integer quantity;
}