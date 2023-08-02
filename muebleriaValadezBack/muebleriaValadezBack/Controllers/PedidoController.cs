using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using muebleriaValadezBack.Models;

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : Controller
    {
        private readonly AppDbContext _context;

        public PedidoController(AppDbContext context) { _context = context; }

        [HttpGet("{idCliente}", Name = "GetAllPedidosCliente")]
        public IActionResult Pedido(int idCliente)
        {
            try
            {
                var results = _context.Set<Pedido>().FromSqlRaw("SELECT * FROM Pedidos WHERE IdCliente = @idCliente",
                    new SqlParameter("@idCliente", idCliente)).ToList();

                return Ok(results);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ObtenerDetalle/{idPedido}", Name = "GetOrdenPedido")]
        public IActionResult GetOrdenPedido(int idPedido)
        {
            try
            {
                var orders = _context.Set<OrdenesPedidos>()
                    .FromSqlRaw("SELECT oP.* FROM OrdenesPedidos oP INNER JOIN Productos p " +
                               "ON oP.IdProducto = p.IdProducto WHERE oP.IdPedido = @idPedido;",
                    new SqlParameter("@idPedido", idPedido)).ToList();

                var products = _context.Set<Productos>()
                    .FromSqlRaw("SELECT p.* FROM OrdenesPedidos oP INNER JOIN Productos p " +
                               "ON oP.IdProducto = p.IdProducto WHERE oP.IdPedido = @idPedido;",
                    new SqlParameter("@idPedido", idPedido)).ToList();

                var response = new OrdenPedidoResponse
                {
                    ordenesPedidos = orders,
                    productos = products
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AgregarPedidoOrden/{precioVenta}&&{idUsuario}", Name = "AgregarPedidoOrden")]
        public IActionResult AddPedido_Detalle([FromBody]PedidoOrdenDto pedidoOrden, float precioVenta, int idUsuario)
        {
            Pedido pedido = pedidoOrden.pedido;
            OrdenesPedidos ordenPedido = pedidoOrden.ordenPedido;
            DateTime fechaActual = DateTime.Now;
            string fechaPedido = fechaActual.ToString("dd-MM-yyyy");
            try
            {
                var parametros = new[]
                {
                    new SqlParameter("@PIdCliente", pedido.IdCliente),
                    new SqlParameter("@PIdTarjeta", pedido.IdTarjeta),
                    new SqlParameter("@PfechaPedido", fechaPedido),
                    new SqlParameter("@Ptotal", pedido.total),
                    new SqlParameter("@Pcodigo", pedido.codigo),
                    new SqlParameter("@PIdDireccion", pedido.IdDireccion),
                    new SqlParameter("@Pcantidad", ordenPedido.cantidad),
                    new SqlParameter("@PIdProducto", ordenPedido.IdProducto),
                    new SqlParameter("@PprecioVenta", precioVenta),
                    new SqlParameter("@PidUsuario", idUsuario)
                };
                _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_Pedido_Orden @PIdCliente, @PIdTarjeta, " +
                                                "@PfechaPedido, @Ptotal, @Pcodigo, @PIdDireccion, @Pcantidad, " +
                                                "@PIdProducto, @PprecioVenta, @PidUsuario;"
                                                , parametros);
                Console.WriteLine("Holaa Estos son tus parametros");
                foreach (var param in parametros)
                {
                    Console.WriteLine(param.Value);
                }
                Console.WriteLine("Fin de parametros");
                _context.SaveChanges();
                return Ok(pedidoOrden);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AgregarPedido/{idUsuario}",Name = "AgregarPedido")]
        public IActionResult AddPedido([FromBody] Pedido pedido, int idUsuario)
        {
            DateTime fechaActual = DateTime.Now;
            string fechaPedido = fechaActual.ToString("dd-MM-yyyy");
            var parametros = new[]
                {
                    new SqlParameter("@PIdCliente", pedido.IdCliente),
                    new SqlParameter("@PIdTarjeta", pedido.IdTarjeta),
                    new SqlParameter("@PfechaPedido", fechaPedido),
                    new SqlParameter("@Ptotal", pedido.total),
                    new SqlParameter("@Pcodigo", pedido.codigo),
                    new SqlParameter("@PIdDireccion", pedido.IdDireccion),
                   new SqlParameter("@PidUsuario", idUsuario)
                };

            try
            {
                _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_Pedido @PIdCliente ,@PIdTarjeta, @PfechaPedido,@Ptotal,@Pcodigo,@PIdDireccion, @PidUsuario"
                                               , parametros);
                _context.SaveChanges();

                return Ok(pedido);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AgregarOrden/{precioProd}&&{idUsuario}", Name = "Agregar_Detalle")]
        public IActionResult Agregar_Detalle([FromBody] OrdenesPedidos ordenPedido, float precioProd, int idUsuario)
        {
            try
            {
                var parametros = new[]
                {
                    new SqlParameter("@Pcantidad", ordenPedido.cantidad),
                    new SqlParameter("@PIdProducto", ordenPedido.IdProducto),
                    new SqlParameter("@PprecioVenta", precioProd),
                    new SqlParameter("@PidUsuario", idUsuario)
                };

                _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_OrdenPedido @Pcantidad, @PIdProducto, @PprecioVenta, @PidUsuario", 
                                                parametros);

                _context.SaveChanges();

                return Ok(ordenPedido);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
