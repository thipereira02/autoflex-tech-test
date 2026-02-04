package com.autoflex.stock.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import com.autoflex.stock.entity.ProductComposition;

@Entity
@Table(name = "products")
public class Product extends PanacheEntity {

    @NotBlank(message = "Name may not be blank")
    public String name;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    public BigDecimal sellingPrice;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ProductComposition> composition = new ArrayList<>();
}