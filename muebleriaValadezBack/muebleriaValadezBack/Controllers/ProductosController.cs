using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;

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

        [HttpGet(Name = "GetAllProducts")] 
        public IActionResult Get()
        {
            try
            {
                var results = _context.Set<Productos>().FromSqlRaw("SELECT * FROM Productos WHERE estatus = 1").ToList();
                return Ok(results);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
