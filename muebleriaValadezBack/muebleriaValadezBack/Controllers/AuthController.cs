using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;
using System;
using System.Data.SqlClient;
using System.Linq;

namespace muebleriaValadezBack.Controllers
{
    [Route("auth/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public ActionResult Login([FromBody] Usuarios usuario)
        {
            try
            {
                // Ejecutar el procedimiento almacenado y obtener los resultados en forma de lista de objetos anónimos

                
                var parameters = new[] {
                    new SqlParameter("@Pemail", usuario.email),
                    new SqlParameter("@Ppassword", usuario.password)
                };

                var results = _context.Set<VistaAuth>().FromSqlRaw("EXEC SP_ConsultarInicioSesion @Pemail, @Ppassword", parameters).ToList();

                if (results.Any())
                {
                    // Devolver los resultados directamente como una lista de objetos anónimos
                    return Ok(results);
                }
                else
                {
                    return NotFound("Usuario no encontrado");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
