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
    public class RepartidorController : ControllerBase
    {

        private readonly AppDbContext _context;

        public RepartidorController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/<ProductosController>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var results = _context.Set<Repartidor>().FromSqlRaw("SELECT idPedido, CONCAT(PER.apellidoPaterno,' ',PER.apellidoMaterno, ' ', PER.nombres) AS nombreCliente,\r\n\t\tCONCAT(D.colonia,', ',DIR.calle,', ',DIR.noExt) AS domicilio, fechaPedido, codigo, total\r\nFROM Pedidos AS P\r\nINNER JOIN Clientes AS C ON P.IdCliente=C.IdCliente\r\nINNER JOIN Personas AS PER ON C.IdPersona=PER.IdPersona\r\nINNER JOIN Direcciones AS DIR ON P.IdDireccion=DIR.IdDireccion\r\nINNER JOIN Domicilios AS D ON DIR.IdDomicilio=D.idDomicilio\r\nWHERE P.estatus=1\r\nORDER BY fechaPedido ").ToList();
                return Ok(results);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public RepartirDetalle GetId(int id)
        {
            var Datageneral = _context.Repartidor
                .FromSqlRaw(@"SELECT idPedido, CONCAT(PER.apellidoPaterno,' ',PER.apellidoMaterno, ' ', PER.nombres) AS nombreCliente, CONCAT(D.colonia,', ',DIR.calle,', ',DIR.noExt) AS domicilio, fechaPedido, codigo, total FROM Pedidos AS P INNER JOIN Clientes AS C ON P.IdCliente=C.IdCliente INNER JOIN Personas AS PER ON C.IdPersona=PER.IdPersona INNER JOIN Direcciones AS DIR ON P.IdDireccion=DIR.IdDireccion INNER JOIN Domicilios AS D ON DIR.IdDomicilio=D.idDomicilio
                        WHERE  P.idPedido={0}", id)
                .FirstOrDefault();

            if (Datageneral == null)
            {
                return null;
            }

        
            var productoData = _context.ProductoRepartir
            .FromSqlRaw(@"SELECT OP.IdOrdenPedido AS RepartirDetalleIdPedido, PRO.IdProducto, PRO.nombreProducto, OP.cantidad
                         FROM Pedidos AS P
                         INNER JOIN OrdenesPedidos AS OP ON P.IdPedido = OP.IdPedido
                         INNER JOIN Productos AS PRO ON OP.IdProducto = PRO.IdProducto
                         WHERE P.IdPedido={0}", id)
            .ToList();

            foreach (var producto in productoData)
            {
                Console.WriteLine($" IdProducto: {producto.IdProducto}, nombreProducto: {producto.nombreProducto}, cantidad: {producto.cantidad}");
                // Puedes mostrar los valores en la consola o utilizarlos como desees en tu aplicación ASP.NET
            }


            var repartirDetalle = new RepartirDetalle
            {
                ProductoRepartir = productoData.Select(producto => new ProductoRepartir
                {
                    IdProducto = producto.IdProducto,
                    nombreProducto = producto.nombreProducto,
                    cantidad = producto.cantidad
                }).ToArray(),
                IdPedido = Datageneral.IdPedido,
                nombreCliente = Datageneral.nombreCliente,
                domicilio = Datageneral.domicilio,
                fechaPedido = Datageneral.fechaPedido,
                codigo = Datageneral.codigo,
                total = Datageneral.total
            };

            return repartirDetalle;
        }

        // PUT api/<ProductosController>/5
        [HttpPut("{id}/{idUsuario}")]
        public ActionResult Put(int id, [FromBody] RepartirDetalle detalle, int idUsuario)
        {
            try
            {

                var parameters = new[]
                {
            new SqlParameter("@IdPedido", id),
            new SqlParameter("@PIdUsuario", idUsuario),
            new SqlParameter("@IdEmpleado", detalle.IdPedido)
        };

                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        // Insert the product using SP_Insertar_Producto
                    _context.Database.ExecuteSqlRaw(
                            "EXEC SP_Modificar_PedidoEntregar @IdPedido, @PIdUsuario,@IdEmpleado",
                            parameters);
                       

                        // If everything is successful, commit the transaction
                        transaction.Commit();
                        return Ok("Repartir and related Product inserted successfully.");
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
