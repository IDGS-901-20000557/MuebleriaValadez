using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using muebleriaValadezBack.Models;
using System.Data;

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : Controller
    {

        private readonly AppDbContext _context;
        public VentasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {

                var ventas = _context.OrdenesVenta
                    .Where(l => l.estatus != '0')
                    .Select(l => new OrdenVenta
                    {
                        IdOrdenVenta = l.IdOrdenVenta,
                        fechaVenta = l.fechaVenta,
                        fechaEntrega = l.fechaEntrega,
                        total = l.total,
                        estatus = l.estatus
                    })
                    .ToList();

                return Ok(ventas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public OrdenVenta Get(int id)
        {
            var ventaData = _context.OrdenesVenta
                .Where(l => l.IdOrdenVenta == id)
                .Select(l => new OrdenVenta
                {
                    IdOrdenVenta = l.IdOrdenVenta,
                    IdCliente = l.IdCliente,
                    tipoPago = l.tipoPago,
                    total = l.total,
                    estatus = l.estatus
                })
                .FirstOrDefault();

            if (ventaData == null)
            {
                return null;
            }

            var productosData = _context.ProductosVenta
                .FromSqlRaw(@"SELECT CAST(P.IdProducto AS bigint) AS idProducto, nombreProducto,  CAST(precioVenta AS float) precioVenta, cantidad, CAST(subtotal AS float) subtotal,  CAST(0 AS bigint) OrdenVentaIdOrdenVenta, CAST(cantidad AS float) cantidadProducto FROM OrdenesVentaProducto AS OVP
                                INNER JOIN Productos AS P ON OVP.IdProducto=P.IdProducto
                                WHERE IdOrdenVenta={0}", id)
                .ToList();

            ventaData.ProductosVenta = productosData.Select(producto => new ProductosVenta
            {
                idProducto = producto.idProducto,
                nombreProducto = producto.nombreProducto,
                precioVenta = producto.precioVenta,
                cantidadProducto = producto.cantidadProducto,
                subtotal = producto.subtotal
            }).ToArray();

            return ventaData;
        }


        [HttpDelete("{id}/{idUsuario}")]
        public IActionResult Delete(int id, int idUsuario)
        {
            try
            {
                var idUsuarioParameter = new SqlParameter("@PIdUsuario", SqlDbType.BigInt) { Value = idUsuario };
                var idVentaParameter = new SqlParameter("@PIdVenta", SqlDbType.BigInt) { Value = id };

                _context.Database.ExecuteSqlRaw("EXEC SP_Eliminar_Venta @PIdUsuario, @PIdVenta", idUsuarioParameter, idVentaParameter);

                return Ok("Venta eliminado exitosamente.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("getCliente")]
        public IActionResult getCliente()
        {
            try
            {

                var clienteQuery = _context.ClienteVentas
                .FromSqlRaw(@"SELECT IdCliente, concat(nombres, ' ',apellidoPaterno, ' ',apellidoMaterno) nombres, apellidoMaterno, apellidoPaterno, telefono, email, password
FROM Clientes AS C
INNER JOIN Personas AS P ON P.IdPersona=C.IdPersona
INNER JOIN Usuarios AS U ON U.idPersona=P.IdPersona
WHERE estatus=1;")
                .ToList();
                return Ok(clienteQuery);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getDomicilios/{cp}")]
        public IActionResult getDomicilios(int cp)
        {
            try
            {
                var domicilios = _context.DomicilioResult
                    .FromSqlRaw("EXEC dbo.SP_ConsultarDomicilios @Pcp", new SqlParameter("@Pcp", cp)) 
                    .ToList();

                return Ok(domicilios);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getDireccion/{id}")]
        public IActionResult GetDirecciones(int id)
        {
            try
            {

                var clienteQuery = _context.DireccionesVentas
                .FromSqlRaw(@"SELECT D.IdDireccion, calle, noExt, noInt, CAST(0 AS bigint) idDomicilio FROM cliente_Direcciones AS CD
INNER JOIN Direcciones AS D ON CD.IdDireccion=D.IdDireccion
WHERE IdCliente="+id)
                .ToList();
                return Ok(clienteQuery);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost("entregarOrdenVenta")]
        public ActionResult entregarOrdenVenta([FromBody] OrdenVenta ordenVenta)
        {
            try
            {
                var ventaParameters = new[]
                {
            new SqlParameter("@PIdUsuario", ordenVenta.IdUsuario),
            new SqlParameter("@PIdEmpleado", ordenVenta.IdEmpleadoMostrador),
            new SqlParameter("@PIdOrdenVenta", ordenVenta.IdOrdenVenta)
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {

                        Dictionary<long, double> cantidadesAgrupadas = new Dictionary<long, double>();

                        foreach (var producto in ordenVenta.ProductosVenta)
                        {
                            if (cantidadesAgrupadas.ContainsKey(producto.idProducto.Value))
                            {
                                cantidadesAgrupadas[producto.idProducto.Value] += producto.cantidadProducto.Value;
                            }
                            else
                            {
                                cantidadesAgrupadas.Add(producto.idProducto.Value, producto.cantidadProducto.Value);
                            }
                        }
                        string idProductosConcatenados = string.Join(",", cantidadesAgrupadas.Keys);
                        foreach (var kvp in cantidadesAgrupadas)
                        {
                            long idProducto = kvp.Key;
                            double cantidad = kvp.Value;
                            var inventarioQuery = _context.ProductosVenta
                            .FromSqlRaw(@"SELECT CAST(P.IdProducto AS bigint) AS idProducto, nombreProducto,  CAST(precioVenta AS float) precioVenta, CAST(0 AS float) subtotal,  CAST(0 AS bigint) OrdenVentaIdOrdenVenta, CAST(cantidaDisponible AS float) cantidadProducto FROM Productos AS P
                                        INNER JOIN Inventario AS I ON P.IdInventario=I.IdInventario 
                                        WHERE IdProducto=" + idProducto)
                            .ToList();

                            foreach (var inventarioItem in inventarioQuery)
                            {
                                if ((inventarioItem.cantidadProducto - cantidad) < 0)
                                {
                                    var productoNombre = inventarioItem.nombreProducto;
                                    return Ok("FALTA - Producto: " + productoNombre);
                                }
                            }
                        }


                        int ventaResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Entrega_OrdenVenta @PIdUsuario, @PIdEmpleado, @PIdOrdenVenta",
                            ventaParameters);



                        if (ventaResult <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while devolep the lote.");
                        }

                        foreach (var producto in ordenVenta.ProductosVenta)
                        {


                            var ventaProductoParameters = new[]
                            {
                        new SqlParameter("@PIdProducto", producto.idProducto ),
                        new SqlParameter("@cantidadProducto", producto.cantidadProducto)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_DisminuirInventario_Producto @PIdProducto, @cantidadProducto", ventaProductoParameters);


                        }


                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("ventra entrega inserted successfully.");
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

        [HttpPut("modificarOrdenVenta")]
        public ActionResult Put([FromBody] OrdenVenta ordenVenta)
        {
            try
            {

                var ventaParameters = new[]
                {
            new SqlParameter("@PIdOrdenVenta", ordenVenta.IdOrdenVenta),
            new SqlParameter("@PIdUsuario", ordenVenta.IdUsuario),
            new SqlParameter("@ptipoPago", ordenVenta.tipoPago),
            new SqlParameter("@Ptotal", ordenVenta.total)
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                        int ventaResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Modificar_OrdenVenta @PIdOrdenVenta, @PIdUsuario, @ptipoPago, @Ptotal",
                            ventaParameters);

                        if (ventaResult <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while updating the lote.");
                        }

                        _context.Database.ExecuteSqlRaw("EXEC SP_Eliminar_OrdenVentaProductos @PIdOrdenVenta", new SqlParameter("@PIdOrdenVenta", ordenVenta.IdOrdenVenta));

                        foreach (var producto in ordenVenta.ProductosVenta)
                        {
                            var ventaProductosParameters = new[]
                            {
                        new SqlParameter("@Pcantidad", producto.cantidadProducto),
                        new SqlParameter("@PIdOrdenVenta", ordenVenta.IdOrdenVenta),
                        new SqlParameter("@Psubtotal", producto.subtotal),
                        new SqlParameter("@PidProducto", producto.idProducto)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_OrdenVentaProducto @Pcantidad, @PIdOrdenVenta, @Psubtotal, @PidProducto", ventaProductosParameters);
                        }

                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("Lote modified successfully.");
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

        [HttpPost("insertOrdenVenta")]
        public ActionResult Post([FromBody] OrdenVenta ordenVenta)
        {
            try
            {
                var ventaIdParameter = new SqlParameter("@OrdenVentaId", SqlDbType.BigInt) { Direction = ParameterDirection.Output };

                var ventaParameters = new[]
                {
            new SqlParameter("@PIdUsuario", ordenVenta.IdUsuario),
            new SqlParameter("@PidEmpleado", ordenVenta.IdEmpleadoMostrador),
            new SqlParameter("@Ptotal", ordenVenta.total),
            new SqlParameter("@PidCliente", ordenVenta.IdCliente),
            new SqlParameter("@PidSucursal", ordenVenta.IdDireccion),
            new SqlParameter("@ptipoPago", ordenVenta.tipoPago),
        ventaIdParameter
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                        int ventaResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Insertar_OrdenVenta @PIdUsuario, @PidEmpleado, @Ptotal, @PidCliente, @PidSucursal, @ptipoPago, @OrdenVentaId OUT",
                            ventaParameters);

                        long ventaId = (long)ventaIdParameter.Value;

                        if (ventaId <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while inserting the venta.");
                        }

                        // Insert libro de receta using SP_Insertar_LibroReceta
                        foreach (var producto in ordenVenta.ProductosVenta)
                        {
                            var ventaProductosParameters = new[]
                            {
                        new SqlParameter("@Pcantidad", producto.cantidadProducto),
                        new SqlParameter("@PIdOrdenVenta", ventaId),
                        new SqlParameter("@Psubtotal", producto.subtotal),
                        new SqlParameter("@PidProducto", producto.idProducto)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_OrdenVentaProducto @Pcantidad, @PIdOrdenVenta, @Psubtotal, @PidProducto", ventaProductosParameters);
                        }

                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("venta inserted successfully.");
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


    }
}
