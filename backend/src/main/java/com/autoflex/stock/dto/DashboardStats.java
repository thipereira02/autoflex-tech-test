package com.autoflex.stock.dto;

public class DashboardStats {
    public long totalProducts;
    public double bestOpportunityValue;
    public long productsReadyToProduce;
    public long criticalStockItems;

    public DashboardStats(long totalProducts, double bestOpportunityValue, long productsReadyToProduce, long criticalStockItems) {
        this.totalProducts = totalProducts;
        this.bestOpportunityValue = bestOpportunityValue;
        this.productsReadyToProduce = productsReadyToProduce;
        this.criticalStockItems = criticalStockItems;
    }
}