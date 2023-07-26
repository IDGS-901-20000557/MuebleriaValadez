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
        public ActionResult Login([FromBody]Usuario usuario)
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

        [HttpPost("userFind")]
        public ActionResult UserFind([FromBody] Usuario usuario)
        {
            try
            {
                // Verificar si el correo electrónico del usuario ya existe en la base de datos
                string email = usuario.email; // Supongamos que el correo electrónico se encuentra en el objeto 'usuario'
                string query = $"SELECT COUNT(*) FROM Usuarios WHERE email = '{email}'";

                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = query;
                    _context.Database.OpenConnection();
                    var result = command.ExecuteScalar();

                    if (result != null && result != DBNull.Value)
                    {
                        int count = Convert.ToInt32(result);
                        // Si count es mayor a cero, significa que el correo electrónico existe en la tabla 'Usuarios'
                        bool userExists = count > 0;
                        return Ok(new { exists = userExists });
                    }
                    else
                    {
                        return BadRequest("Error al verificar el correo electrónico del usuario.");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public ActionResult Post([FromBody] Usuario user)
        {
            try
            {
                var parameters = new[] {
                    new SqlParameter("@Pnombres", user.persona.nombres),
                    new SqlParameter("@PapellidoPaterno", user.persona.apellidoPaterno),
                    new SqlParameter("@PapellidoMaterno", user.persona.apellidoMaterno),
                    new SqlParameter("@Ptelefono", user.persona.telefono),
                    new SqlParameter("@Pemail", user.email),
                    new SqlParameter("@Ppassword", user.password),
                    new SqlParameter("@PId_Rol", '3')
                };
                _context.Database.ExecuteSqlRaw("EXEC SP_Insertar_Cliente @Pnombres, @PapellidoPaterno, @PapellidoMaterno, @Ptelefono, @Pemail, @Ppassword, @PId_Rol", parameters);
                return Ok("Cliente insertado correctamente");
            }
            catch (Exception ex)
            {
                // Verificar si hay una excepción interna
                if (ex.InnerException != null)
                {
                    // Obtener detalles de la excepción interna
                    string innerMessage = ex.InnerException.Message;
                    string innerStackTrace = ex.InnerException.StackTrace;
                    // Puedes imprimir los detalles o registrarlos en un archivo de registro para su análisis.
                }
                // Devolver una respuesta de error adecuada a la solicitud
                return BadRequest("An error occurred while saving the entity changes. See the inner exception for details.");
            }
        }
    }
}
