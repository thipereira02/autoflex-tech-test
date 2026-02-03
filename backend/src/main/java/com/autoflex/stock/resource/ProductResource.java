package com.autoflex.stock.resource;

import com.autoflex.stock.entity.Product;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

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
    public Response create(@Valid Product product) {
        if (product.id != null) {
            throw new WebApplicationException("Id was invalidly set on request.", 422);
        }
        product.persist();
        return Response.status(201).entity(product).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Product update(@PathParam("id") Long id, @Valid Product product) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Product not found", 404);
        }
        entity.name = product.name;
        entity.sellingPrice = product.sellingPrice;
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
}