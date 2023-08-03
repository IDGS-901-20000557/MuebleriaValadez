using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarjetaController : Controller
    {
        private readonly AppDbContext _context;

        public TarjetaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{idCliente}",Name = "GetTarjetas")]
        public IActionResult GetTarjetas(int idCliente)
        {
            try{
                var results = _context.Set<Tarjetas>()
                   .FromSqlRaw("SELECT * FROM Tarjetas WHERE idCliente = @idCliente", new SqlParameter("@idCliente", idCliente)).ToList();

                return Ok(results);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
