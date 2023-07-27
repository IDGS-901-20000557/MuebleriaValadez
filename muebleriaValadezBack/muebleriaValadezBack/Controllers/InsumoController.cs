using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InsumoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InsumoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet(Name ="GetAllInsumos")] // api/<Insumos> GET ALL
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Insumos.ToList());

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}", Name = "GetById")] // api/<Insumos> GET BY ID
        public IActionResult Get(int id)
        {
            try
            {
                var insumo = _context.Insumos.FirstOrDefault(x => x.IdInsumo == id);
                return Ok(insumo);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost] // api/<Insumos> INSERT Insumo
        public ActionResult<Insumo> Post([FromBody] Insumo insumo)
        {
            try
            {
                long idUsuario = 10002;
                // Llamamos al stored procedure pasando los parámetros del insumo
                _context.Database.ExecuteSqlInterpolated($@"
                    EXEC usp_InsertInsumo 
                        @nombreInsumo={insumo.nombreInsumo}, 
                        @IdProveedor={insumo.IdProveedor}, 
                        @unidad={insumo.unidad}, 
                        @precio={insumo.precio}, 
                        @observaciones={insumo.observaciones}, 
                        @cantidaAceptable={insumo.cantidadAceptable}, 
                        @IdUsuario={idUsuario};
                ");

                return CreatedAtRoute("GetAllInsumos", null);
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

        [HttpPut("{id}")] // api/<Insumos> UPDATE Insumo
        public ActionResult Put(int id, [FromBody] Insumo updatedInsumo)
        {
            try
            {
                var existingInsumo = _context.Insumos.FirstOrDefault(x => x.IdInsumo == id);
                if (existingInsumo == null)
                {
                    return NotFound();
                }

                existingInsumo.nombreInsumo = updatedInsumo.nombreInsumo;
                existingInsumo.IdProveedor = updatedInsumo.IdProveedor;
                existingInsumo.IdInventario = updatedInsumo.IdInventario;
                existingInsumo.unidad = updatedInsumo.unidad;
                existingInsumo.precio = updatedInsumo.precio;
                existingInsumo.observaciones = updatedInsumo.observaciones;
                existingInsumo.cantidadAceptable = updatedInsumo.cantidadAceptable;

                _context.SaveChanges();

                return Ok(existingInsumo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")] // api/<Insumos>/ DELETE
        public ActionResult Delete(int id)
        {
            try
            {
                // Llama al procedimiento almacenado usp_DeleteInsumo y pasa el idInsumo e idUsuario como parámetros
                var idUsuario = 10002; // Suponiendo que el IdUsuario autenticado es 10002
                _context.Database.ExecuteSqlInterpolated($"EXEC usp_DeleteInsumo {id}, {idUsuario}");

                return Ok(new { message = "Insumo eliminado correctamente." });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
