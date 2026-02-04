package com.autoflex.stock.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductComposition extends PanacheEntity {
    
    @ManyToOne
    public Product product;

    @ManyToOne
    public RawMaterial rawMaterial;

    public double requiredQuantity;
}