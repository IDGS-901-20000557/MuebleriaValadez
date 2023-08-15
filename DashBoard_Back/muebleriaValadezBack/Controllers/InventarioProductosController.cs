using DashBoardBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DashBoardBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Inventario : Controller
    {
        private readonly AppDbContext _context;

        public Inventario(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("Productos", Name = "GetInventoryProduct")]
        public IActionResult GetInventarioProductos()
        {
            try
            {
                var results = _context.Set<Inventario_Productos>()
                   .FromSqlRaw("SELECT * FROM Inventory_Products").ToList();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Insumos", Name = "GetInventoryIngredient")]
        public IActionResult GetInventarioInsumos()
        {
            try
            {
                var results = _context.Set<Inventario_Insumos>()
                   .FromSqlRaw("SELECT * FROM Inventory_Ingredients").ToList();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
