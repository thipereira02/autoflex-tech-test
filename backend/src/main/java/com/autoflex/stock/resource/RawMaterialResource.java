package com.autoflex.stock.resource;

import com.autoflex.stock.entity.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> getAll() {
        return RawMaterial.listAll();
    }

    @POST
    @Transactional
    public Response create(RawMaterial rawMaterial) {
        rawMaterial.persist();
        return Response.status(Response.Status.CREATED).entity(rawMaterial).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, RawMaterial data) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Raw Material not found", 404);
        }
        entity.name = data.name;
        entity.stockQuantity = data.stockQuantity;
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Raw Material not found", 404);
        }
        entity.delete();
    }
}