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

        [HttpGet("getAddress")]
        public ActionResult GetAddress()
        {
            try
            {
                var results = _context.Direcciones.Include(x => x.domicilio).ToList();
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


        [HttpGet("getClienteDirecciones")]
        public ActionResult GetClienteDirecciones(int idCliente)
        {
            try
            {
                var results = _context.cliente_Direcciones.Include(x => x.direccion).ThenInclude(x => x.domicilio).Where(x => x.idCliente == idCliente).ToList();
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

        [HttpPost("addAddress")]

        public ActionResult AddAddress(RegistroAdressViewModel registro, long idUsuariob)
        {
            try
            {

                //verificar que no sean null o "" los campos

                if (registro.calle == null || registro.calle == "" || registro.noExt == 0 || registro.IdDomicilio == 0 || registro.IdDomicilio == null)
                {
                    return BadRequest("Todos los campos marcados con * son obligatorios");
                }



                Direccion direccion = new Direccion();
                direccion.calle = registro.calle;
                direccion.noExt = registro.noExt;
                direccion.noInt = registro.noInt;
                direccion.IdDomicilio = registro.IdDomicilio;


                _context.Direcciones.Add(direccion);
                _context.SaveChanges();


                ClienteDirecciones clienteDirecciones = new ClienteDirecciones();
                clienteDirecciones.idCliente_Direccion = direccion.IdDireccion;
                clienteDirecciones.idCliente = registro.idCliente;
                clienteDirecciones.idDireccion = direccion.IdDireccion;

                _context.cliente_Direcciones.Add(clienteDirecciones);
                _context.SaveChanges();


                var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "inserción"),
                    new SqlParameter("@modulo", "Administrar Perfil"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +"  agrego una nueva direccion"),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);

                return Ok("Direccion agregada");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("getAdressbyid")]

        public ActionResult GetAdressbyid(long idDireccion)
        {
            try
            {
                var results = _context.Direcciones.Include(x => x.domicilio).Where(x => x.IdDireccion == idDireccion).ToList();
                if (results != null)
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

        [HttpPost("updateAddress")]

        public ActionResult UpdateAddress(RegistroAdressViewModel registro, long idDireccion, long idUsuariob)
        {
            try
            {

                //verificar que no sean null o "" los campos

                if (registro.calle == null || registro.calle == "" || registro.noExt == 0 || registro.IdDomicilio == 0 || registro.IdDomicilio == null)
                {
                    return BadRequest("Todos los campos marcados con * son obligatorios");
                }


                //obtener la direccion a actualizar
                var direccion = _context.Direcciones.Where(x => x.IdDireccion == idDireccion).FirstOrDefault();
                if (direccion != null)
                {

                    direccion.calle = registro.calle;
                    direccion.noExt = registro.noExt;
                    direccion.noInt = registro.noInt;
                    direccion.IdDomicilio = registro.IdDomicilio;

                    _context.Direcciones.Update(direccion);
                    _context.SaveChanges();

                    var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "modificacion"),
                    new SqlParameter("@modulo", "Administrar Perfil"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +"  modifico una direccion"),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);

                    return Ok("Direccion actualizada");
                }
                else
                {
                    return NotFound("No se encontro la direccion");

                }

            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPost("deleteAddress")]

        public ActionResult DeleteAddress(long idDireccion, long idUsuariob)
        {
            try
            {
                //borrar primero la relacion de cliente_direccion
                var clienteDireccion = _context.cliente_Direcciones.Where(x => x.idDireccion == idDireccion).FirstOrDefault();
                if (clienteDireccion != null)
                {
                    _context.cliente_Direcciones.Remove(clienteDireccion);
                    _context.SaveChanges();
                }


                var direccion = _context.Direcciones.Where(x => x.IdDireccion == idDireccion).FirstOrDefault();
                if (direccion != null)
                {
                    _context.Direcciones.Remove(direccion);
                    _context.SaveChanges();

                    var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "Eliminacion"),
                    new SqlParameter("@modulo", "Administrar Perfil"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +" elimino una direccion"),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);
                    return Ok("Direccion eliminada");
                }
                else
                {
                    return NotFound("No se encontro la direccion");

                }

            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }




    }

    public class RegistroAdressViewModel
    {

        public String calle { get; set; }
        public int noExt { get; set; }
        public int? noInt { get; set; }

        public long IdDomicilio { get; set; }

        public long idCliente { get; set; }





    }
}

