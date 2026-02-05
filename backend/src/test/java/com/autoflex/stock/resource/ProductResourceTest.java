package com.autoflex.stock.resource;

import com.autoflex.stock.entity.Product;
import com.autoflex.stock.entity.ProductComposition;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class ProductResourceTest {

    @BeforeEach 
    @AfterEach
    @Transactional
    void cleanUp() {
        ProductComposition.deleteAll();
        Product.deleteAll();
    }

    @Test
    public void testCreateAndListProduct() {
        Product p = new Product();
        p.name = "Cadeira Gamer";
        p.sellingPrice = BigDecimal.valueOf(1500.00);

        given()
            .contentType("application/json")
            .body(p)
            .when().post("/api/products")
            .then()
                .statusCode(201)
                .body("name", is("Cadeira Gamer"));

        given()
            .when().get("/api/products")
            .then()
                .statusCode(200)
                .body("size()", is(1))
                .body("[0].sellingPrice", is(1500.0f));
    }
}