package com.autoflex.stock.dto;

public class ProductionPlan {
    public String productName;
    public long maxQuantity;
    public double totalValue;
    
    public ProductionPlan() {}

    public ProductionPlan(String productName, long maxQuantity, double totalValue) {
        this.productName = productName;
        this.maxQuantity = maxQuantity;
        this.totalValue = totalValue;
    }
}