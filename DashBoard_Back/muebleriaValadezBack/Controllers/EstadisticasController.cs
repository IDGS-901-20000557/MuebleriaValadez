using DashBoardBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DashBoardBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadisticasController : Controller
    {
        private readonly AppDbContext _context;

        public EstadisticasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("ValoresCalculados", Name = "GetValoresCalculados")]
        public IActionResult GetValoresCalculados()
        {
            try
            {
                var results = _context.Set<ValoresCalculados>()
                   .FromSqlRaw("SELECT * FROM valores_calculados").ToList();
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("MejoresClientes", Name = "GetMejoresClientes")]
        public IActionResult GetMejoresClientes()
        {
            try
            {
                var results = _context.Set<MejoresClientes>()
                   .FromSqlRaw("SELECT * FROM Best_Clients").ToList();
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("VentasMensuales", Name = "GetVentasMensuales")]
        public IActionResult GetVentasMensuales()
        {
            try
            {
                var results = _context.Set<VentasMensuales>()
                   .FromSqlRaw("SELECT * FROM ventas_mensuales").ToList();
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("MejoresProductos", Name = "GetMejoresProductos")]
        public IActionResult GetMejoresProductos()
        {
            try
            {
                var results = _context.Set<Productos>()
                   .FromSqlRaw("SELECT * FROM mayor_vendido_producto").ToList();
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("PeoresProductos", Name = "GetMenoresProductos")]
        public IActionResult GetMenoresProductos()
        {
            try
            {
                var results = _context.Set<Productos>()
                   .FromSqlRaw("SELECT * FROM menor_vendido_producto").ToList();
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
