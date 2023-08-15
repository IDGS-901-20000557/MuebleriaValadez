using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;

//integracion del proyecto

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
                
                var maskedResults = results.Select(item => new
                {
                    item.IdTarjeta,
                    numeroTarejta = MaskCreditCardNumber(item.numeroTarejta),
                    item.nombreTitular,
                    item.vencimiento,
                    item.cvv,
                    item.tipo,
                    item.IdCliente
                }).ToList();

                return Ok(maskedResults);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Función para enmascarar el número de tarjeta
        private string MaskCreditCardNumber(long creditCardNumber)
        {
            string creditCardStr = creditCardNumber.ToString();
            int visibleDigits = 4; // Cantidad de dígitos visibles en el número de tarjeta

            if (creditCardStr.Length <= visibleDigits)
            {
                return creditCardStr; // No hay suficientes dígitos para enmascarar
            }

            // Enmascarar todos los dígitos excepto los últimos 'visibleDigits'
            string maskedPart = new string('*', creditCardStr.Length - visibleDigits);
            string visiblePart = creditCardStr.Substring(creditCardStr.Length - visibleDigits);

            return maskedPart + visiblePart;
        }


        [HttpPost("CrearTarjeta")]


        public IActionResult CrearTarjeta(RegistroTarjetaViewModel registro, long idUsuariob)
        {

            try
            {


                var tarjeta = new Tarjetas();

                tarjeta.IdCliente = registro.IdCliente;
                tarjeta.numeroTarejta = registro.numeroTarejta;
                tarjeta.vencimiento = registro.Vencimiento;
                tarjeta.cvv = registro.CVV;
                tarjeta.nombreTitular = registro.NombreTitular;
                tarjeta.tipo = registro.Tipo;



                // validamos que no exista el numero de tarjeta

                var tarjetaExistente = _context.Tarjetas.FirstOrDefault(t => t.numeroTarejta == registro.numeroTarejta);

                if (tarjetaExistente != null)
                {

                    return BadRequest(new { status = "error", message = "Ya existe una tarjeta con ese numero." });

                }


                // validamos que ningun campo este vacio

                if (tarjeta.numeroTarejta == null || tarjeta.vencimiento == null || tarjeta.cvv == null || tarjeta.nombreTitular == null || tarjeta.tipo == null || tarjeta.IdCliente == 0 || tarjeta.IdCliente == 0 || tarjeta.numeroTarejta == 0 || tarjeta.vencimiento == "" || tarjeta.cvv == 0 || tarjeta.nombreTitular == "" || tarjeta.tipo == "" || tarjeta.IdCliente == null)
                {

                    return BadRequest(new { status = "error", message = "Todos los campos son obligatorios." });

                }




                _context.Tarjetas.Add(tarjeta);
                _context.SaveChanges();





                var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "inserción"),
                    new SqlParameter("@modulo", "Administrar Perfil"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +"  agrego una tarjeta"),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);

                return Ok(new { status = "success", message = "Tarjeta creada exitosamente." });


            }
            catch (Exception ex)
            {

                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });


            }
        }





        [HttpPost("EliminarTarjeta")]

        public IActionResult EliminarTarjeta(long id, long idUsuariob)
        {
            try
            {
                var tarjeta = _context.Tarjetas.FirstOrDefault(t => t.IdTarjeta == id);

                if (tarjeta != null)
                {
                    _context.Tarjetas.Remove(tarjeta);
                    _context.SaveChanges();

                    var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "Eliminacion"),
                    new SqlParameter("@modulo", "Administrar Perfil"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +"  eliminó la tarjeta: " + tarjeta.IdTarjeta),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);


                    return Ok(new { status = "success", message = "Tarjeta eliminada exitosamente." });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "No se encontró la tarjeta." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }





        [HttpPost("GetTarjetas")]

        public IActionResult GetTarjetas(long id)
        {
            try
            {



                var tarjetas = _context.Tarjetas.Where(t => t.IdCliente == id).ToList();

                if (tarjetas != null)
                {
                    if (tarjetas.Count == 0)
                    {
                        return BadRequest(new { status = "error", message = "No se encontraron tarjetas." });
                    }
                    return Ok(new { status = "success", message = "Tarjetas obtenidas exitosamente.", data = tarjetas });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "No se encontraron tarjetas." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost("GetTarjeta")]

        public IActionResult GetTarjeta(long id)
        {
            try
            {


                var tarjetas = _context.Tarjetas.Where(t => t.IdTarjeta == id).ToList();

                if (tarjetas != null)
                {
                    if (tarjetas.Count == 0)
                    {
                        return BadRequest(new { status = "error", message = "No se encontraron tarjetas." });
                    }
                    return Ok(new { status = "success", message = "Tarjetas obtenidas exitosamente.", data = tarjetas });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "No se encontraron tarjetas." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }


        }
    }
    public class RegistroTarjetaViewModel
    {

        public long IdCliente { get; set; }


        public string Tipo { get; set; }

        public long numeroTarejta { get; set; }

        public string NombreTitular { get; set; }

        public string Vencimiento { get; set; }

        public int CVV { get; set; }



    }


}


