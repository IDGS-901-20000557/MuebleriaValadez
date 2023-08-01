using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;
using System.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductosController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/<ProductosController>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var productosConEstatusUno = _context.Productos
                    .Where(p => p.estatus == '1')
                    .Select(p => new Productos 
                    {
                        idProducto = p.idProducto,
                        nombreProducto = p.nombreProducto,
                        costoProduccion = p.costoProduccion,
                        precioVenta = p.precioVenta,
                        cantidadAceptable = p.cantidadAceptable
                    })
                    .ToList();

                return Ok(productosConEstatusUno);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        // GET api/<ProductosController>/5

        [HttpGet("{id}")]
        public LibroReceta Get(int id)
        {
            var productosData = _context.ProductosData
                .FromSqlRaw(@"SELECT DISTINCT Productos.IdProducto, nombreProducto, descripcion, foto, costoProduccion, precioVenta, observaciones, cantidadAceptable
                              FROM LibroRecetas 
                              INNER JOIN Productos ON Productos.IdProducto=LibroRecetas.IdProducto
                              WHERE Productos.IdProducto={0}", id)
                .FirstOrDefault();

            if (productosData == null)
            {
                return null;
            }

            var insumosData = _context.InsumoData
                .FromSqlRaw(@"SELECT IdLibroReceta LibroRecetaidLibroReceta, Insumos.IdInsumo, nombreInsumo, precio, cantidadInsumo, unidad
                              FROM LibroRecetas 
                              INNER JOIN Insumos ON Insumos.IdInsumo=LibroRecetas.IdInsumo
                              WHERE IdProducto={0}", id)
                .ToList();

            var libroReceta = new LibroReceta
            {
                InsumosLibroRecetas = insumosData.Select(insumo => new InsumoData
                {
                    IdInsumo = insumo.IdInsumo,
                    nombreInsumo = insumo.nombreInsumo,
                    precio = insumo.precio,
                    cantidadInsumo = insumo.cantidadInsumo,
                    unidad = insumo.unidad
                }).ToArray(),
                productoLibroRecetas = new ProductosData
                {
                    idProducto = productosData.idProducto,
                    nombreProducto = productosData.nombreProducto,
                    descripcion = productosData.descripcion,
                    foto = productosData.foto,
                    costoProduccion = productosData.costoProduccion,
                    precioVenta = productosData.precioVenta,
                    observaciones = productosData.observaciones,
                    cantidadAceptable = productosData.cantidadAceptable
                },
                // Agregar otras propiedades de LibroReceta, si las tienes
                idUsuario = null, // Asigna el valor adecuado si es necesario
                idSucursal = null // Asigna el valor adecuado si es necesario
            };

            return libroReceta;
        }
    

    // POST api/<ProductosController>
    [HttpPost]
        public ActionResult Post([FromBody] LibroReceta libroReceta)
        {
            try
            {
                var productIdParameter = new SqlParameter("@ProductId", SqlDbType.BigInt) { Direction = ParameterDirection.Output };

                var productParameters = new[]
                {
            new SqlParameter("@PIdUsuario", libroReceta.idUsuario),
            new SqlParameter("@PIdSucursal", libroReceta.idSucursal),
            new SqlParameter("@PnombreProducto", libroReceta.productoLibroRecetas.nombreProducto),
            new SqlParameter("@Pdescripcion", libroReceta.productoLibroRecetas.descripcion),
            new SqlParameter("@Pfoto", libroReceta.productoLibroRecetas.foto),
            new SqlParameter("@PcostoProduccion", libroReceta.productoLibroRecetas.costoProduccion),
            new SqlParameter("@PprecioVenta", libroReceta.productoLibroRecetas.precioVenta),
            new SqlParameter("@Pobservaciones", libroReceta.productoLibroRecetas.observaciones),
            new SqlParameter("@PcantidadAceptable", libroReceta.productoLibroRecetas.cantidadAceptable),
        productIdParameter
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                        int productResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Insertar_Producto @PIdUsuario, @PIdSucursal, @PnombreProducto, @Pdescripcion, @Pfoto, @PcostoProduccion, @PprecioVenta, @Pobservaciones, @PcantidadAceptable, @ProductId OUT",
                            productParameters);

                        long productId = (long)productIdParameter.Value;

                        if (productId <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while inserting the product.");
                        }
                       
                        // Insert libro de receta using SP_Insertar_LibroReceta
                        foreach (var insumo in libroReceta.InsumosLibroRecetas)
                        {
                            var libroRecetaParameters = new[]
                            {
                        new SqlParameter("@PIdProducto", productId),
                        new SqlParameter("@PIdInsumo", insumo.IdInsumo),
                        new SqlParameter("@PcantidadInsumo", insumo.cantidadInsumo)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_LibroReceta @PIdProducto, @PIdInsumo, @PcantidadInsumo", libroRecetaParameters);
                        }

                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("LibroReceta and related Product inserted successfully.");
                    }
                    catch (Exception ex)
                    {
                        // If any exception occurs during the transaction, rollback the changes
                        transaction.Rollback();

                        // Verificar si hay una excepción interna
                        if (ex.InnerException != null)
                        {
                            // Obtener detalles de la excepción interna
                            string innerMessage = ex.InnerException.Message;
                            string innerStackTrace = ex.InnerException.StackTrace;
                            // Puedes imprimir los detalles o registrarlos en un archivo de registro para su análisis.
                        }

                        // Devolver una respuesta de error adecuada a la solicitud
                        return BadRequest(ex);
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the database operation
                return BadRequest(ex);
            }
        }

    // PUT api/<ProductosController>/5
    [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] LibroReceta libroReceta)
        {
            try
            {
                var productIdParameter = new SqlParameter("@ProductId", SqlDbType.BigInt) { Direction = ParameterDirection.Output };

                var productParameters = new[]
                {
            new SqlParameter("@PIdProducto", id),
            new SqlParameter("@PIdUsuario", libroReceta.idUsuario),
            new SqlParameter("@PnombreProducto", libroReceta.productoLibroRecetas.nombreProducto),
            new SqlParameter("@Pdescripcion", libroReceta.productoLibroRecetas.descripcion),
            new SqlParameter("@Pfoto", libroReceta.productoLibroRecetas.foto),
            new SqlParameter("@PcostoProduccion", libroReceta.productoLibroRecetas.costoProduccion),
            new SqlParameter("@PprecioVenta", libroReceta.productoLibroRecetas.precioVenta),
            new SqlParameter("@Pobservaciones", libroReceta.productoLibroRecetas.observaciones),
            new SqlParameter("@PcantidadAceptable", libroReceta.productoLibroRecetas.cantidadAceptable),
        productIdParameter
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                        int productResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Modificar_Producto @PIdProducto, @PIdUsuario, @PnombreProducto, @Pdescripcion, @Pfoto, @PcostoProduccion, @PprecioVenta, @Pobservaciones, @PcantidadAceptable",
                            productParameters);

                        if (productResult <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while updating the product.");
                        }

                        _context.Database.ExecuteSqlRaw("EXEC SP_Eliminar_LibrosRecetas @PIdProducto", new SqlParameter("@PIdProducto", id));
                        // Insert libro de receta using SP_Insertar_LibroReceta
                        foreach (var insumo in libroReceta.InsumosLibroRecetas)
                        {
                            var libroRecetaParameters = new[]
                            {
                        new SqlParameter("@PIdProducto", id),
                        new SqlParameter("@PIdInsumo", insumo.IdInsumo),
                        new SqlParameter("@PcantidadInsumo", insumo.cantidadInsumo)
                    };
                            // Eliminar libros de recetas existentes utilizando SP_Eliminar_LibrosRecetas
                           

                            _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_LibroReceta @PIdProducto, @PIdInsumo, @PcantidadInsumo", libroRecetaParameters);
                        }

                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("LibroReceta and related Product inserted successfully.");
                    }
                    catch (Exception ex)
                    {
                        // If any exception occurs during the transaction, rollback the changes
                        transaction.Rollback();

                        // Verificar si hay una excepción interna
                        if (ex.InnerException != null)
                        {
                            // Obtener detalles de la excepción interna
                            string innerMessage = ex.InnerException.Message;
                            string innerStackTrace = ex.InnerException.StackTrace;
                            // Puedes imprimir los detalles o registrarlos en un archivo de registro para su análisis.
                        }

                        // Devolver una respuesta de error adecuada a la solicitud
                        return BadRequest(ex);
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during the database operation
                return BadRequest(ex);
            }
        }

        // DELETE api/<ProductosController>/5
        [HttpDelete("{id}/{idUsuario}")]
        public IActionResult Delete(int id, int idUsuario)
        {
            try
            {
                var idUsuarioParameter = new SqlParameter("@PIdUsuario", SqlDbType.BigInt) { Value = idUsuario };
                var idProductoParameter = new SqlParameter("@PIdProducto", SqlDbType.BigInt) { Value = id };

                _context.Database.ExecuteSqlRaw("EXEC SP_Eliminar_Producto @PIdUsuario, @PIdProducto", idUsuarioParameter, idProductoParameter);

                return Ok("Producto eliminado exitosamente.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
