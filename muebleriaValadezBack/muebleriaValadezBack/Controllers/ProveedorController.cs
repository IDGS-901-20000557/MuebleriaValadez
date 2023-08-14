using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;

namespace muebleriaValadezBack.Controllers
{
    [Route("proveedor/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProveedorController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("proveedores")]

        public IActionResult Proveedores()
        {
            try
            {
                var proveedores = _context.Proveedores.Include(pr => pr.Persona).ToList();

                if (proveedores.Count > 0)
                {
                    return new JsonResult(proveedores);
                }
                else
                {
                    var error = new { error = "No hay proveedores registrados" };

                    return new JsonResult(error);
                }

            }
            catch (Exception ex)

            {
                return new JsonResult(ex);

            }


        }

        [HttpPost("registerProv")]

        public IActionResult RegistrarProveedor(RegistroViewModelProv registroProv, long idUsuariob)
        {
            try
            {
                if (registroProv.nombres == null || registroProv.apellidoPaterno == null || registroProv.apellidoMaterno == null || registroProv.telefono == "")
                {
                    return BadRequest(new { status = "error", message = "Todos los campos son obligatorios." });
                }
                if (registroProv.nombres == "" || registroProv.apellidoPaterno == "" || registroProv.apellidoMaterno == "" || registroProv.telefono == "")
                {
                    return BadRequest(new { status = "error", message = "Todos los campos son obligatorios." });
                }



                var persona = new Personas
                {
                    nombres = registroProv.nombres,
                    apellidoPaterno = registroProv.apellidoPaterno,
                    apellidoMaterno = registroProv.apellidoMaterno,
                    telefono = registroProv.telefono
                };

                _context.Personas.Add(persona);

                _context.SaveChanges();

                var proveedor = new ProveedorDTO
                {
                    nombreEmpresa = registroProv.nombreEmpresa,
                    informacionExtra = registroProv.informacionExtra,
                    estatus = '1',
                    IdPersona = persona.IdPersona
                };

                _context.Proveedores.Add(proveedor);

                _context.SaveChanges();


                var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "insersion"),
                    new SqlParameter("@modulo", "Proveedor"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +" ha registrado un nuevo proveedor: " + proveedor.nombreEmpresa),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);

                return Ok(new { status = "success", message = "Proveedor registrado correctamente." });

            }

            catch (Exception ex)
            {
                return BadRequest(new { status = "error", message = ex.Message });
            }


        }


        [HttpPost("updateProv")]

        public IActionResult ModificarProveedor(RegistroViewModelProv registroProv, int idProveedor, long idUsuariob)
        {

            try
            {

                var proveedor = _context.Proveedores.Include(pr => pr.Persona).FirstOrDefault(pr => pr.IdProveedor == idProveedor);

                if (proveedor == null)
                {
                    return BadRequest(new { status = "error", message = "No existe el proveedor." });
                }


                //modificar persona

                proveedor.Persona.nombres = registroProv.nombres;
                proveedor.Persona.apellidoPaterno = registroProv.apellidoPaterno;
                proveedor.Persona.apellidoMaterno = registroProv.apellidoMaterno;
                proveedor.Persona.telefono = registroProv.telefono;

                //modificar proveedor

                proveedor.nombreEmpresa = registroProv.nombreEmpresa;
                proveedor.informacionExtra = registroProv.informacionExtra;
                //proveedor.estatus = registroProv.estatus;

                _context.SaveChanges();

                var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "modificacion"),
                    new SqlParameter("@modulo", "Proveedor"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +" ha modificado el proveedor: " + proveedor.nombreEmpresa),
                    new SqlParameter("@fecha", DateTime.Now)
                };

                _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);

                return Ok(new { status = "success", message = "Proveedor modificado correctamente." });




            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "error", message = ex.Message });
            }
        }



        [HttpPost("EliminarProveedor")]

        public IActionResult EliminarProveedor(long id, long idUsuariob)
        {
            try
            {
                var proveedor = _context.Proveedores.FirstOrDefault(u => u.IdProveedor == id);

                if (proveedor != null)
                {
                    proveedor.estatus = '0';

                    _context.SaveChanges();


                    var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "modificacion"),
                    new SqlParameter("@modulo", "Proveedor"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +" ha desactivado el proveedor: " + proveedor.nombreEmpresa),
                    new SqlParameter("@fecha", DateTime.Now)
                };
                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);


                    return Ok(new { status = "success", message = "Proveedor eliminado exitosamente." });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "No se encontró el proveedor." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost("ActivarProveedor")]

        public IActionResult ActivarProveedor(long id, long idUsuariob)
        {
            try
            {
                var proveedor = _context.Proveedores.FirstOrDefault(u => u.IdProveedor == id);

                if (proveedor != null)
                {
                    proveedor.estatus = '1';

                    _context.SaveChanges();


                    var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "modificacion"),
                    new SqlParameter("@modulo", "Proveedor"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +" ha activado el proveedor: " + proveedor.nombreEmpresa),
                    new SqlParameter("@fecha", DateTime.Now)
                };
                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);

                    return Ok(new { status = "success", message = "Proveedor Activado exitosamente." });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "No se encontró el proveedor." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }



        public class RegistroViewModelProv
        {
            public string nombreEmpresa { get; set; }
            public string nombres { get; set; }
            public string apellidoPaterno { get; set; }
            public string apellidoMaterno { get; set; }

            public string telefono { get; set; }

            public string informacionExtra { get; set; }

            // public char? estatus { get; set; }


        }

    }
}
