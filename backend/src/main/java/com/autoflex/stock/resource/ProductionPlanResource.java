package com.autoflex.stock.resource;

import com.autoflex.stock.dto.ProductionPlan;
import com.autoflex.stock.entity.Product;
import com.autoflex.stock.entity.ProductComposition;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Path("/api/production-plan")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionPlanResource {

    @GET
    public List<ProductionPlan> getPlan() {
        List<Product> products = Product.listAll();
        List<ProductionPlan> plans = new ArrayList<>();

        for (Product product : products) {
            if (product.composition == null || product.composition.isEmpty()) {
                plans.add(new ProductionPlan(product.name, 0, 0.0));
                continue;
            }

            long maxPossible = Long.MAX_VALUE;

            for (ProductComposition item : product.composition) {
                double stock = item.rawMaterial.stockQuantity;
                double required = item.requiredQuantity;

                if (required <= 0) continue;

                long possibleWithThisItem = (long) (stock / required);

                if (possibleWithThisItem < maxPossible) {
                    maxPossible = possibleWithThisItem;
                }
            }

            if (maxPossible == Long.MAX_VALUE) maxPossible = 0;

            BigDecimal quantityBD = BigDecimal.valueOf(maxPossible);
            BigDecimal totalValueBD = product.sellingPrice.multiply(quantityBD);
            
            double totalValue = totalValueBD.doubleValue();
            plans.add(new ProductionPlan(product.name, maxPossible, totalValue));
        }

        plans.sort(Comparator.comparingDouble((ProductionPlan p) -> p.totalValue).reversed());

        return plans;
    }
}