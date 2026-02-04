package com.autoflex.stock.dto;

public class DashboardStats {
    public long totalProducts;
    public double totalValue;
    
    public DashboardStats() {}

    public DashboardStats(long totalProducts, double totalValue) {
        this.totalProducts = totalProducts;
        this.totalValue = totalValue;
    }
}