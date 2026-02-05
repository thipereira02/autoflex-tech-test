package com.autoflex.stock.resource;

import com.autoflex.stock.dto.ProductionPlan;
import com.autoflex.stock.entity.Product;
import com.autoflex.stock.entity.ProductComposition;
import com.autoflex.stock.entity.RawMaterial;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@QuarkusTest
public class ProductionPlanResourceTest {

    @Inject
    ProductionPlanResource resource;

    @BeforeEach
    @Transactional
    void cleanUp() {
        ProductComposition.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();
    }

    @Test
    @Transactional
    public void testProductionBottleneckCalculation() {
        // --- CENÁRIO ---
        RawMaterial farinha = new RawMaterial();
        farinha.name = "Farinha";
        farinha.stockQuantity = 100.0;
        farinha.unit = "KG";
        farinha.persist();

        RawMaterial cenoura = new RawMaterial();
        cenoura.name = "Cenoura";
        cenoura.stockQuantity = 5.0;
        cenoura.unit = "UN";
        cenoura.persist();

        Product bolo = new Product();
        bolo.name = "Bolo de Cenoura";
        bolo.sellingPrice = BigDecimal.valueOf(20.0);
        bolo.composition = new ArrayList<>();
        bolo.persist();

        ProductComposition item1 = new ProductComposition();
        item1.product = bolo;
        item1.rawMaterial = farinha;
        item1.requiredQuantity = 2.0;
        item1.persist();

        ProductComposition item2 = new ProductComposition();
        item2.product = bolo;
        item2.rawMaterial = cenoura;
        item2.requiredQuantity = 1.0;
        item2.persist();

        bolo.composition.add(item1);
        bolo.composition.add(item2);
        bolo.persist();

        List<ProductionPlan> resultado = resource.getProductionPlan();

        Assertions.assertNotNull(resultado);
        Assertions.assertEquals(1, resultado.size());

        ProductionPlan plano = resultado.get(0);

        Assertions.assertEquals("Bolo de Cenoura", plano.productName); 
        Assertions.assertEquals(5, plano.maxQuantity);
        Assertions.assertEquals(100.0, plano.totalValue, 0.01);
    }
}