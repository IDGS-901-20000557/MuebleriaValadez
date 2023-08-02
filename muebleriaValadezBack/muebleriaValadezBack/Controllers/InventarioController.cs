using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;

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

        [HttpGet(Name = "GetAllInventario")]
        public IActionResult Get()
        {
            try
            {
                var results = _context.Set<Inventario>()
                    .FromSqlRaw("SELECT * FROM Inventario").ToList();
                return Ok(results);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}", Name = "GetInventarioById")] 
        public IActionResult Get(int id)
        {
            try
            {
                var insumo = _context.Inventario.FirstOrDefault(item => item.IdInventario == id);
                return Ok(insumo);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
