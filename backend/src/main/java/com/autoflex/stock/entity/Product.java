package com.autoflex.stock.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product extends PanacheEntity {

    @NotBlank(message = "Name may not be blank")
    public String name;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    public BigDecimal sellingPrice;
}