package com.autoflex.stock.resource;

import com.autoflex.stock.entity.Product;
import com.autoflex.stock.dto.DashboardStats;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.math.BigDecimal;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @GET
    public List<Product> list() {
        return Product.listAll();
    }

    @GET
    @Path("/{id}")
    public Product get(@PathParam("id") Long id) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Product not found", 404);
        }
        return entity;
    }

    @POST
    @Transactional
    public Response create(Product product) {
        if (product.composition != null) {
            product.composition.forEach(item -> item.product = product);
        }
        
        product.persist();
        return Response.status(Response.Status.CREATED).entity(product).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Product update(@PathParam("id") Long id, Product productData) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Product not found", 404);
        }
        
        // Atualiza dados básicos
        entity.name = productData.name;
        entity.sellingPrice = productData.sellingPrice;

        entity.composition.clear();
        if (productData.composition != null) {
            productData.composition.forEach(item -> {
                item.product = entity;
                entity.composition.add(item);
            });
        }
        
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Product not found", 404);
        }
        entity.delete();
    }

    @GET
    @Path("/stats")
    public DashboardStats getStats() {
        long count = Product.count();
        
        BigDecimal sum = Product.getEntityManager()
            .createQuery("SELECT SUM(p.sellingPrice) FROM Product p", BigDecimal.class)
            .getSingleResult();
        
        double totalValue = (sum != null) ? sum.doubleValue() : 0.0;
        
        return new DashboardStats(count, totalValue);
    }
}