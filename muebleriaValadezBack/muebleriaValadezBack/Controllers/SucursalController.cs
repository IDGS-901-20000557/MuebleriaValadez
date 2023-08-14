using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;
using System.Diagnostics;

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SucursalController : Controller
    {
        private readonly AppDbContext _context;

        public SucursalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetAllSucursales")] // api/<Sucursales> GET ALL
        public IActionResult Get()
        {
            try
            {
                var sucursales = _context.Sucursales.Include(s => s.direccion).ToList();
                return Ok(sucursales);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{idUsuario}/{idDomicilio}", Name = "InsertSucursal")] // api/<Sucursal> INSERT Sucursal
        public ActionResult<Sucursal> Post([FromBody] Sucursal sucursal, int idUsuario, int idDomicilio)
        {
            try
            {
                // Llamamos al stored procedure pasando los parámetros de la sucursal
                _context.Database.ExecuteSqlInterpolated($@"
                    EXEC usp_InsertSucursal 
                        @razonSocial={sucursal.razonSocial}, 
                        @calle={sucursal.direccion.calle},
                        @noExt={sucursal.direccion.noExt},
                        @noInt={sucursal.direccion.noInt},
                        @IdUsuario={idUsuario},
                        @IdDomicilio={idDomicilio}
                ");

                return Ok(new { message = "Sucursal creada correctamente." });
            }
            catch (Exception ex)
            {
                // Capturar y registrar la excepción interna
                string errorMessage = "Un error ocurrió al salvar los cambios.";
                if (ex.InnerException != null)
                {
                    errorMessage += " Inner exception: " + ex.InnerException.Message;
                }

                // Devolver detalles del error en la respuesta HTTP
                return BadRequest(errorMessage);
            }
        }

        [HttpPut("{id}/{idUsuario}/{idDireccion}/{idDomicilio}")] // api/<Sucursal> UPDATE Sucursal
        public ActionResult Put(int id, [FromBody] Sucursal updatedSucursal, int idUsuario, int idDireccion ,int idDomicilio)
        {
            try
            {
                var existingSucursal = _context.Sucursales.FirstOrDefault(x => x.IdSucursal == id);
                if (existingSucursal == null)
                {
                    return NotFound();
                }

                _context.Database.ExecuteSqlInterpolated($@"
                    EXEC usp_UpdateSucursal
                    @IdSucursal={id},      
                    @razonSocial={updatedSucursal.razonSocial},
                    @calle={updatedSucursal.direccion.calle}, 
                    @noExt={updatedSucursal.direccion.noExt}, 
                    @noInt={updatedSucursal.direccion.noInt},
                    @IdDireccion={idDireccion},
                    @IdDomicilio={idDomicilio},  
                    @IdUsuario={idUsuario};
                ");

                _context.SaveChanges();

                return Ok(existingSucursal);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}/{idUsuario}", Name = "DeleteSucursal")] // api/<Sucursales>/ DELETE
        public ActionResult Delete(int id, int idUsuario)
        {
            try
            {
                _context.Database.ExecuteSqlInterpolated($"EXEC usp_DeleteSucursal {id}, {idUsuario}");

                return Ok(new { message = "Sucursal eliminada correctamente." });

            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error al eliminar la sucursal: {ex.Message}");
                return StatusCode(500, "Error interno del servidor al eliminar la sucursal.");
            }
        }

        [HttpGet("getEstados")]
        public ActionResult GetEstados()
        {
            try
            {
                var results = _context.Domicilios.Select(x => x.estado).Distinct().ToList();
                if (results.Any())
                {
                    return Ok(results);
                }
                else
                {
                    return NotFound("No hay direcciones");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getCiudades")]

        public ActionResult GetCiudades(string estado)
        {
            try
            {
                var results = _context.Domicilios.Where(x => x.estado == estado).Select(x => x.ciudad).Distinct().ToList();
                if (results.Any())
                {
                    return Ok(results);
                }
                else
                {
                    return NotFound("No hay direcciones");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("getCp")]
        public ActionResult GetDirecciones(string ciudad)
        {
            try
            {
                var results = _context.Domicilios.Where(x => x.ciudad == ciudad).Select(x => x.cp).Distinct().ToList();
                if (results.Any())
                {
                    return Ok(results);
                }
                else
                {
                    return NotFound("No hay direcciones");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("getColonia")]

        public ActionResult GetColonia(int cp)
        {

            try
            {
                var results = _context.Domicilios.Where(x => x.cp == cp).ToList();
                if (results.Any())
                {
                    return Ok(results);
                }
                else
                {
                    return NotFound("No hay direcciones");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
