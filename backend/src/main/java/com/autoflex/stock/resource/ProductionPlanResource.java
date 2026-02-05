package com.autoflex.stock.resource;

import com.autoflex.stock.dto.ProductionPlan;
import com.autoflex.stock.entity.Product;
import com.autoflex.stock.entity.ProductComposition;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Path("/api/production-plan")
public class ProductionPlanResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProductionPlan> getProductionPlan() {
        List<Product> products = Product.listAll();
        List<ProductionPlan> plans = new ArrayList<>();

        for (Product product : products) {
            long maxProduction = Long.MAX_VALUE;

            if (product.composition == null || product.composition.isEmpty()) {
                maxProduction = 0;
            } else {
                for (ProductComposition item : product.composition) {
                    double stock = item.rawMaterial.stockQuantity;
                    double required = item.requiredQuantity;

                    if (required > 0) {
                        long possible = (long) (stock / required);
                        if (possible < maxProduction) {
                            maxProduction = possible;
                        }
                    }
                }
            }

            if (maxProduction == Long.MAX_VALUE) {
                maxProduction = 0;
            }

            double totalValue = maxProduction * product.sellingPrice.doubleValue();

            plans.add(new ProductionPlan(product.name, maxProduction, totalValue));
        }

        plans.sort(Comparator.comparingDouble((ProductionPlan p) -> p.totalValue).reversed());

        return plans;
    }
}