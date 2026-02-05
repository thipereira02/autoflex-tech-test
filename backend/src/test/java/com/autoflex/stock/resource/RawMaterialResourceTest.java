package com.autoflex.stock.resource;

import com.autoflex.stock.entity.ProductComposition;
import com.autoflex.stock.entity.RawMaterial;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThan;

@QuarkusTest
public class RawMaterialResourceTest {

    @AfterEach
    @Transactional
    void cleanUp() {
        ProductComposition.deleteAll();
        RawMaterial.deleteAll();
    }

    @Test
    public void testListRawMaterials() {
        RawMaterial rm = new RawMaterial();
        rm.name = "Plástico ABS";
        rm.stockQuantity = 50.0;
        rm.unit = "KG";
        executePersist(rm);

        given()
            .when().get("/api/raw-materials")
            .then()
                .statusCode(200)
                .body("size()", is(1))
                .body("[0].name", is("Plástico ABS"));
    }

    @Test
    public void testCreateRawMaterial() {
        RawMaterial novo = new RawMaterial();
        novo.name = "Aço Inox";
        novo.stockQuantity = 100.0;
        novo.unit = "BARRA";

        given()
            .contentType("application/json")
            .body(novo)
            .when().post("/api/raw-materials")
            .then()
                .statusCode(201)
                .body("name", is("Aço Inox"))
                .body("id", greaterThan(0));
    }

    @Test
    public void testDeleteRawMaterial() {
        RawMaterial rm = new RawMaterial();
        rm.name = "Lixo";
        rm.stockQuantity = 0.0;
        rm.unit = "KG";
        executePersist(rm);

        given()
            .when().delete("/api/raw-materials/" + rm.id)
            .then()
                .statusCode(204);

        given()
            .when().get("/api/raw-materials")
            .then()
                .body("size()", is(0));
    }

    @Transactional
    void executePersist(RawMaterial rm) {
        rm.persist();
    }
}