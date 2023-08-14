using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;
using System.Diagnostics;
using System.Security.Claims;

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

        [HttpGet(Name = "GetAllInsumos")] // api/<Insumos> GET ALL
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

        [HttpPost("{idUsuario}/{idSucursal}")] // api/<Insumos> INSERT Insumo
        public ActionResult<Insumo> Post([FromBody] Insumo insumo, int idUsuario, int idSucursal)
        {
            try
            {
                // Llamamos al stored procedure pasando los parámetros del insumo
                _context.Database.ExecuteSqlInterpolated($@"
                    EXEC usp_InsertInsumo 
                        @nombreInsumo={insumo.nombreInsumo}, 
                        @IdProveedor={insumo.IdProveedor}, 
                        @unidad={insumo.unidad}, 
                        @precio={insumo.precio}, 
                        @observaciones={insumo.observaciones}, 
                        @cantidaAceptable={insumo.cantidadAceptable}, 
                        @IdUsuario={idUsuario},
                        @IdSucursal={idSucursal};
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

        [HttpPut("{id}/{idUsuario}")] // api/<Insumos> UPDATE Insumo
        public ActionResult Put(int id, [FromBody] Insumo updatedInsumo, int idUsuario)
        {
            try
            {
                var existingInsumo = _context.Insumos.FirstOrDefault(x => x.IdInsumo == id);
                if (existingInsumo == null)
                {
                    return NotFound();
                }

                _context.Database.ExecuteSqlInterpolated($@"
                    EXEC usp_UpdateInsumo 
                    @IdInsumo={id},      
                    @nombreInsumo={updatedInsumo.nombreInsumo}, 
                    @IdProveedor={updatedInsumo.IdProveedor}, 
                    @unidad={updatedInsumo.unidad}, 
                    @precio={updatedInsumo.precio}, 
                    @observaciones={updatedInsumo.observaciones}, 
                    @cantidaAceptable={updatedInsumo.cantidadAceptable}, 
                    @IdUsuario={idUsuario};
                ");

                _context.SaveChanges();

                return Ok(existingInsumo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}/{idUsuario}")] // api/<Insumos>/ DELETE
        public ActionResult Delete(int id, int idUsuario)
        {
            try
            {
                _context.Database.ExecuteSqlInterpolated($"EXEC usp_DeleteInsumo {id}, {idUsuario}");

                return Ok(new { message = "Insumo eliminado correctamente." });

            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error al eliminar el insumo: {ex.Message}");
                return StatusCode(500, "Error interno del servidor al eliminar el insumo.");
            }
        }

        [HttpGet("proveedores", Name = "GetAllProveedores")] // api/Insumo/proveedores GET ALL Proveedores
        public IActionResult GetAllProveedores()
        {
            try
            {
                var proveedores = _context.Proveedores.ToList();
                return Ok(proveedores);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
