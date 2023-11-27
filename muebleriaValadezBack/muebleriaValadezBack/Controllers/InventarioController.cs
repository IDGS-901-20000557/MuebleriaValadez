using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;
using System.Data;

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventarioController : Controller
    {
        private readonly AppDbContext _context;
        public InventarioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAll", Name = "ObtenerInventario")]
        public IActionResult GetAllInvent()
        {
            try
            {
                var results = _context.Set<Inventario>().FromSqlRaw("SELECT * FROM Inventario").ToList();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {

                var lotes = _context.Lotes
                    .Where(l => l.estatus != '0')
                    .Select(l => new Lotes
                    {
                        IdLote = l.IdLote,
                        noLote = l.noLote,
                        observaciones = l.observaciones,
                        fechaGenerado = l.fechaGenerado,
                        costo = l.costo,
                        estatus = l.estatus,
                    })
                    .ToList();

                return Ok(lotes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getInventario")]
        public IActionResult GetInventario()
        {
            try
            {
         
                var inventarioQuery = _context.InventarioResult
                .FromSqlRaw(@"
            SELECT nombreProducto AS nombre,  CAST(costoProduccion AS float) AS costo, CAST(cantidadAceptable AS float) cantidadAceptable, CAST(cantidaDisponible AS float) cantidaDisponible, 'Producto' AS tipo
            FROM Productos AS P
            INNER JOIN Inventario AS I ON P.IdInventario = I.IdInventario
            WHERE estatus = 1
            UNION
            SELECT nombreInsumo AS nombre, CAST(precio AS float) AS costo, CAST(cantidadAceptable AS float) cantidadAceptable , CAST(cantidaDisponible AS float) cantidaDisponible, 'Insumo' AS tipo
            FROM Insumos AS INS
            INNER JOIN Inventario AS I ON INS.IdInventario = I.IdInventario
            WHERE estatus = 1")
                .ToList();
                return Ok(inventarioQuery);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("entregarLoteInsumo")]
        public ActionResult entregarLoteInsumo([FromBody] Lotes lote)
        {
            try
            {
                var loteParameters = new[]
                {
            new SqlParameter("@PIdUsuario", lote.idUsuario),
            new SqlParameter("@PIdLote", lote.IdLote)
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        int loteResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Entrega_Lote @PIdUsuario, @PIdLote",
                            loteParameters);

                   

                        if (loteResult <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while devolep the lote.");
                        }

                        foreach (var insumo in lote.InsumosLote)
                        {
                            var loteInsumoParameters = new[]
                            {
                        new SqlParameter("@PIdInsumo", insumo.IdInsumo),
                        new SqlParameter("@cantidadInsumo", insumo.cantidadInsumo)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_AumentarInventario_Insumo @PIdInsumo, @cantidadInsumo", loteInsumoParameters);
                        }

                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("lote Insumo and related Product inserted successfully.");
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

        [HttpPost("entregarLoteProducto")]
        public ActionResult entregarLoteProducto([FromBody] Lotes lote)
        {
            try
            {
                var loteParameters = new[]
                {
            new SqlParameter("@PIdUsuario", lote.idUsuario),
            new SqlParameter("@PIdLote", lote.IdLote)
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {

                        Dictionary<long, double> cantidadesAgrupadas = new Dictionary<long, double>();

                        foreach (var producto in lote.ProductosLote)
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
                            var inventarioQuery = _context.InsumoLote
                            .FromSqlRaw(@"SELECT CAST(INS.IdInsumo AS bigint) AS IdInsumo, cantidaDisponible AS cantidadInsumo, CAST(0 AS bigint) LotesIdLote, nombreInsumo, CAST(cantidadInsumo AS float) precio, unidad  
                            FROM LibroRecetas AS LR 
                            INNER JOIN Insumos AS INS ON LR.IdInsumo=INS.IdInsumo
                            INNER JOIN Inventario AS I ON INS.IdInventario=I.IdInventario
                            WHERE IdProducto =" + idProducto + " group by INS.IdInsumo, cantidaDisponible, nombreInsumo, precio, unidad, cantidadInsumo")
                            .ToList();



                            foreach (var inventarioItem in inventarioQuery)
                            {
                                if ((inventarioItem.cantidadInsumo - inventarioItem.precio * cantidad) < 0)
                                {
                                    var insumoNombre = inventarioItem.nombreInsumo;
                                    return Ok("FALTA - Insumo: " + insumoNombre);
                                }

                            }


                         }
                        //foreach (var inventarioItem in inventarioQuery)
                        //{
                        //    long? idInsumo = inventarioItem.IdInsumo;
                        //    double? cantidadDisponible = inventarioItem.cantidadInsumo;
                            
                        //    foreach (var kvp in cantidadesAgrupadas)
                        //    {
                        //        long idProducto = kvp.Key;
                        //        double cantidad = kvp.Value;

                        //        var prefectQuery = _context.InsumoLote
                        //    .FromSqlRaw(@"SELECT CAST(I.IdInsumo AS bigint) AS IdInsumo, CAST(cantidadInsumo AS float) AS cantidadInsumo,  nombreInsumo,  precio, unidad, CAST(0 AS bigint) LotesIdLote FROM LibroRecetas AS LR
                        //                  INNER JOIN Productos AS P ON LR.IdProducto=P.IdProducto
                        //                  INNER JOIN Insumos AS I ON LR.IdInsumo=I.IdInsumo
                        //                  WHERE P.IdProducto IN (" + idProducto + ") and I.IdInsumo =" + idInsumo + "")
                        //    .ToList();

                        //        foreach (var item in prefectQuery)
                        //        {
                        //            Console.WriteLine($"IdInsumo: {item.IdInsumo}, cantidadInsumo: {item.cantidadInsumo}, nombreInsumo: {item.nombreInsumo}, precio: {item.precio}, unidad: {item.unidad}");
                        //        }
                        //        double? sumaCantidadesInsumo = prefectQuery.Sum(item => item.cantidadInsumo);


                        //        if ((cantidadDisponible - sumaCantidadesInsumo * cantidad) < 0)
                        //        {
                        //            var insumoNombre = prefectQuery.FirstOrDefault()?.nombreInsumo ?? "Desconocido";
                        //            return Ok("FALTA - Insumo: " + insumoNombre);
                        //        }
                        //        Console.WriteLine($"IdProducto: {idProducto}, Cantidad: {cantidad}");
                        //    }
                           

                        //}


                        int loteResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Entrega_Lote @PIdUsuario, @PIdLote",
                            loteParameters);



                        if (loteResult <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while devolep the lote.");
                        }

                        foreach (var producto in lote.ProductosLote)
                        {


                            var loteProductoParameters = new[]
                            {
                        new SqlParameter("@PIdProducto", producto.idProducto ),
                        new SqlParameter("@cantidadProducto", producto.cantidadProducto)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_AumentarInventario_Producto @PIdProducto, @cantidadProducto", loteProductoParameters);

                            var inventarioQuery = _context.InsumoLote
                            .FromSqlRaw(@"SELECT CAST(INS.IdInsumo AS bigint) AS IdInsumo, cantidaDisponible AS cantidadInsumo, CAST(0 AS bigint) LotesIdLote, nombreInsumo, CAST(cantidadInsumo AS float) precio, unidad  
                            FROM LibroRecetas AS LR 
                            INNER JOIN Insumos AS INS ON LR.IdInsumo=INS.IdInsumo
                            INNER JOIN Inventario AS I ON INS.IdInventario=I.IdInventario
                            WHERE IdProducto =" + producto.idProducto + " group by INS.IdInsumo, cantidaDisponible, nombreInsumo, precio, unidad, cantidadInsumo")
                            .ToList();

                            foreach (var inventarioItem in inventarioQuery)
                            {
                                var loteInsumosParameters = new[]
                            {
                        new SqlParameter("@PIdInsumo", inventarioItem.IdInsumo ),
                        new SqlParameter("@PIdProducto", producto.idProducto ),
                        new SqlParameter("@cantidadProducto", producto.cantidadProducto)
                    };
                                _context.Database.ExecuteSqlRaw("EXEC SP_DisminuirInventario_Insumo @PIdInsumo,  @PIdProducto,@cantidadProducto", loteInsumosParameters);

                            }
                        }

                      



                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("lote Producto and related Product inserted successfully.");
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


        // POST: InventarioController/Create
        [HttpPost("insertLoteInsumo")]
        public ActionResult Post([FromBody] Lotes lote)
        {
            try
            {
                var loteIdParameter = new SqlParameter("@LoteId", SqlDbType.BigInt) { Direction = ParameterDirection.Output };

                var loteParameters = new[]
                {
            new SqlParameter("@PIdUsuario", lote.idUsuario),
            new SqlParameter("@PnoLote", lote.noLote),
            new SqlParameter("@Pobservaciones", lote.observaciones),
            new SqlParameter("@PIdSucursal", lote.idSucursal),
            new SqlParameter("@Pcosto", lote.costo),
        loteIdParameter
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                        int loteResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Insertar_Lote @PIdUsuario, @PnoLote, @Pobservaciones, @PIdSucursal, @Pcosto, @LoteId OUT",
                            loteParameters);

                        long loteId = (long)loteIdParameter.Value;

                        if (loteId <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while inserting the lote.");
                        }

                        // Insert libro de receta using SP_Insertar_LibroReceta
                        foreach (var insumo in lote.InsumosLote)
                        {
                            var loteInsumoParameters = new[]
                            {
                        new SqlParameter("@PIdLote", loteId),
                        new SqlParameter("@PIdInsumo", insumo.IdInsumo),
                        new SqlParameter("@PcantidadInsumo", insumo.cantidadInsumo)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_LoteInsumos @PIdLote, @PIdInsumo, @PcantidadInsumo", loteInsumoParameters);
                        }

                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("lote Insumo and related Product inserted successfully.");
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

        [HttpPost("insertLoteProducto")]
        public ActionResult PostProducto([FromBody] Lotes lote)
        {
            try
            {
                var loteIdParameter = new SqlParameter("@LoteId", SqlDbType.BigInt) { Direction = ParameterDirection.Output };

                var loteParameters = new[]
                {
            new SqlParameter("@PIdUsuario", lote.idUsuario),
            new SqlParameter("@PnoLote", lote.noLote),
            new SqlParameter("@Pobservaciones", lote.observaciones),
            new SqlParameter("@PIdSucursal", lote.idSucursal),
            new SqlParameter("@Pcosto", lote.costo),
        loteIdParameter
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                        int loteResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Insertar_Lote @PIdUsuario, @PnoLote, @Pobservaciones, @PIdSucursal, @Pcosto, @LoteId OUT",
                            loteParameters);

                        long loteId = (long)loteIdParameter.Value;

                        if (loteId <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while inserting the lote.");
                        }

                
                        foreach (var producto in lote.ProductosLote)
                        {
                            var loteProductoParameters = new[]
                            {
                        new SqlParameter("@PIdLote", loteId),
                        new SqlParameter("@PIdProducto", producto.idProducto),
                        new SqlParameter("@PcantidadProducto", producto.cantidadProducto)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_LoteProductos @PIdLote, @PIdProducto, @PcantidadProducto", loteProductoParameters);
                        }

                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("lote producto inserted successfully.");
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
                var idProductoParameter = new SqlParameter("@PIdLote", SqlDbType.BigInt) { Value = id };

                _context.Database.ExecuteSqlRaw("EXEC SP_Eliminar_Lote @PIdUsuario, @PIdLote", idUsuarioParameter, idProductoParameter);

                return Ok("Lote eliminado exitosamente.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public Lotes Get(int id)
        {
            var loteData = _context.Lotes
                .Where(l => l.IdLote == id)
                .Select(l => new Lotes
                {
                    IdLote = l.IdLote,
                    noLote = l.noLote,
                    observaciones = l.observaciones,
                    fechaGenerado = l.fechaGenerado,
                    costo = l.costo,
                    estatus = l.estatus
                })
                .FirstOrDefault();

            if (loteData == null)
            {
                return null;
            }

            var insumosData = _context.InsumoLote
    .FromSqlRaw(@"SELECT CAST(I.IdInsumo AS bigint) AS IdInsumo, nombreInsumo, CAST(precio AS float) precio, cantidadInsumo, unidad, CAST(0 AS bigint) LotesIdLote FROM InsumosLotes AS IL
              INNER JOIN Insumos AS I ON IL.IdInsumo=I.IdInsumo
              WHERE IdLote={0}", id)
    .ToList();
            var productosData = _context.ProductoLote
                .FromSqlRaw(@"SELECT CAST(P.IdProducto AS bigint) AS idProducto, nombreProducto, CAST(costoProduccion AS float) costoProduccion, CAST(cantidadProducto AS float) cantidadProducto, CAST(0 AS bigint) LotesIdLote, CAST(cantidadAceptable AS float) cantidadAceptable, descripcion, foto, observaciones,  CAST(precioVenta AS float) precioVenta FROM ProductoLotes AS PL
                      INNER JOIN Productos AS P ON PL.IdProducto=P.IdProducto
                      WHERE IdLote={0}", id)
                .ToList();

            loteData.InsumosLote = insumosData.Select(insumo => new InsumoLote
            {
                IdInsumo = insumo.IdInsumo,
                nombreInsumo = insumo.nombreInsumo,
                precio = insumo.precio,
                cantidadInsumo = insumo.cantidadInsumo,
                unidad = insumo.unidad
            }).ToArray();

            loteData.ProductosLote = productosData.Select(producto => new ProductosLote
            {
                idProducto = producto.idProducto,
                nombreProducto = producto.nombreProducto,
                costoProduccion = producto.costoProduccion,
                cantidadProducto = producto.cantidadProducto
            }).ToArray();

            return loteData;
        }

        [HttpPut("modificarLoteInsumo")]
        public ActionResult Put([FromBody] Lotes lote)
        {
            try
            {

                var loteParameters = new[]
                {
            new SqlParameter("@PIdLote", lote.IdLote),
            new SqlParameter("@PIdUsuario", lote.idUsuario),
            new SqlParameter("@Pobservaciones", lote.observaciones),
            new SqlParameter("@Pcosto", lote.costo)
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                        int productResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Modificar_Lote @PIdLote, @PIdUsuario, @Pobservaciones, @Pcosto",
                            loteParameters);

                        if (productResult <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while updating the lote.");
                        }

                        _context.Database.ExecuteSqlRaw("EXEC SP_Eliminar_LoteInsumo @PIdLote", new SqlParameter("@PIdLote", lote.IdLote));

                        foreach (var insumo in lote.InsumosLote)
                        {
                            var loteInsumoParameters = new[]
                            {
                        new SqlParameter("@PIdLote", lote.IdLote),
                        new SqlParameter("@PIdInsumo", insumo.IdInsumo),
                        new SqlParameter("@PcantidadInsumo", insumo.cantidadInsumo)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_LoteInsumos @PIdLote, @PIdInsumo, @PcantidadInsumo", loteInsumoParameters);
                        
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

        [HttpPut("modificarLoteProducto")]
        public ActionResult modificarLoteProducto([FromBody] Lotes lote)
        {
            try
            {

                var loteParameters = new[]
                {
            new SqlParameter("@PIdLote", lote.IdLote),
            new SqlParameter("@PIdUsuario", lote.idUsuario),
            new SqlParameter("@Pobservaciones", lote.observaciones),
            new SqlParameter("@Pcosto", lote.costo)
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                        int productResult = _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Modificar_Lote @PIdLote, @PIdUsuario, @Pobservaciones, @Pcosto",
                            loteParameters);

                        if (productResult <= 0)
                        {
                            // Failed to insert the product, handle the error as needed
                            return BadRequest("Error occurred while updating the lote.");
                        }

                        _context.Database.ExecuteSqlRaw("EXEC SP_Eliminar_LoteProducto @PIdLote", new SqlParameter("@PIdLote", lote.IdLote));

                        foreach (var producto in lote.ProductosLote)
                        {
                            var loteProductoParameters = new[]
                            {
                        new SqlParameter("@PIdLote", lote.IdLote),
                        new SqlParameter("@PIdProducto", producto.idProducto),
                        new SqlParameter("@PcantidadProducto", producto.cantidadProducto)
                    };

                            _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_LoteProductos @PIdLote, @PIdProducto, @PcantidadProducto", loteProductoParameters);
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




    }
}
