using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DireccionController : Controller
    {
        private readonly AppDbContext _context;

        public DireccionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{idCliente}", Name = "GetDireccionCliente")]
        public IActionResult Get(int idCliente)
        {
            try
            {
                var results = _context.Set<Direccion>()
                   .FromSqlRaw("SELECT dir.IdDireccion, dir.calle, dir.noExt, dir.noInt, dir.IdDomicilio " +
                                "FROM Direcciones dir INNER JOIN cliente_Direcciones ClDir ON ClDir.IdDireccion = dir.IdDireccion " +
                                "WHERE ClDir.IdCliente = @idCliente;", new SqlParameter("@idCliente", idCliente)).ToList();
                return Ok(results);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
