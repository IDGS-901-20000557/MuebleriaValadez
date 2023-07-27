using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using muebleriaValadezBack.Models;
using System;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Security.Cryptography;

namespace muebleriaValadezBack.Controllers
{
    [Route("user/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("users")]
        public IActionResult Index()
        {
            try
            {
                var clientes = _context.Usuarios
                    .Include(u => u.Persona)
                    .Join(
                        _context.Usuarios_Roles,
                        u => u.IdUsuario,
                        ur => ur.IdUsuario,
                        (u, ur) => new
                        {
                            u.IdUsuario,
                            u.email,
                            u.password,
                            u.IdPersona,
                            u.Persona.nombres,
                            u.Persona.apellidoPaterno,
                            u.Persona.apellidoMaterno,
                            u.Persona.telefono,
                            ur.IdRol
                        }
                    )
                    .Join(
                        _context.Roles,
                        ur => ur.IdRol,
                        r => r.IdRol,
                        (ur, r) => new
                        {
                            ur.IdUsuario,
                            ur.email,
                            ur.password,
                            ur.IdPersona,
                            ur.nombres,
                            ur.apellidoPaterno,
                            ur.apellidoMaterno,
                            ur.telefono,
                            ur.IdRol,
                            r.nombre,
                            r.descripcion
                        }
                    )
                
                    .ToList();




                if (clientes.Count > 0 )
                {
                    return new JsonResult(clientes);
                }
                else
                {
                    var error = new { status = "error", message = "No hay usuarios registrados" };
                    return new JsonResult(error);
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }

        [HttpGet("empleados")]
        public IActionResult empleados()
        {
            try
            {
                //  var clientes = _context.Usuarios.Include(u => u.Persona).ToList();
               // var empleados = _context.Sucursales.ToList();

              var empleados =  _context.Usuarios
                      .Join(
                          _context.Personas,
                          usuario => usuario.IdPersona,
                          persona => persona.IdPersona,
                          (usuario, persona) => new
                          {
                              usuario.IdUsuario,
                              usuario.email,
                              usuario.password,
                              PersonaId = persona.IdPersona,
                              persona.nombres,
                              persona.apellidoPaterno,
                              persona.apellidoMaterno,
                              persona.telefono
                          }
                      )
                      .Join(
                          _context.Empleados,
                          up => up.PersonaId,
                          empleado => empleado.IdPersona,
                          (up, empleado) => new
                          {
                              up.IdUsuario,
                              up.email,
                              up.password,
                              up.PersonaId,
                              up.nombres,
                              up.apellidoPaterno,
                              up.apellidoMaterno,
                              up.telefono,
                              EmpleadoId = empleado.IdEmpleado,
                              empleado.rfc,
                              empleado.puesto,
                              empleado.idSucursal // Agregar el campo de la sucursal desde la tabla Empleados
                          }
                      )
                      .Join(
                          _context.Sucursales,
                          ue => ue.idSucursal, // Clave foránea desde la tabla Empleados
                          sucursal => sucursal.idSucursal, // Clave primaria de la tabla Sucursales
                          (ue, sucursal) => new // Combina la información de usuario/empleado con la sucursal
                          {
                              ue.IdUsuario,
                              ue.email,
                              ue.password,
                              ue.PersonaId,
                              ue.nombres,
                              ue.apellidoPaterno,
                              ue.apellidoMaterno,
                              ue.telefono,
                              ue.EmpleadoId,
                              ue.rfc,
                              ue.puesto,
                              SucursalId = sucursal.idSucursal,
                              sucursal.razonSocial,
                              sucursal.idDireccion
                          }
                      )
                      .ToList();


                if (empleados.Count > 0)
                {
                    return new JsonResult(empleados);
                }
                else
                {
                    var error = new { status = "error", message = "No hay usuarios registrados" };
                    return new JsonResult(error);
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }
        [HttpPost("register")]
        public IActionResult RegistrarUsuario(RegistroViewModel registro)
        {

            if (registro.Nombres == null || registro.ApellidoPaterno == null || registro.ApellidoMaterno == null || registro.Telefono == null || registro.Email == null || registro.Password == null)
            {
                return BadRequest(new { status = "error", message = "Todos los campos son obligatorios." });
            }

            if (registro.Nombres == "" || registro.ApellidoPaterno == "" || registro.ApellidoMaterno == "" || registro.Telefono == "" || registro.Email == "" || registro.Password == "")
            {
                return BadRequest(new { status = "error", message = "Todos los campos son obligatorios." });
            }

            if (_context.Usuarios.Any(u => u.email == registro.Email))
            {
                return BadRequest(new { status = "error", message = "El correo ya está registrado." });
            }

            bool passwordValido = VerificarPassword(registro.Password);
            if (!passwordValido)
            {
                return BadRequest(new { status = "error", message = "El password no cumple con los requisitos mínimos." });
            }

        

            try
            {
                // Crear la entidad Persona
                var persona = new Personas
                {
                    nombres = registro.Nombres,
                    apellidoPaterno = registro.ApellidoPaterno,
                    apellidoMaterno = registro.ApellidoMaterno,
                    telefono = registro.Telefono
                };

                _context.Personas.Add(persona);
                _context.SaveChanges();

                // Crear la entidad Usuario

                //encriptar la password 

                var passwordEncriptada = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(registro.Password));

                var password = System.Text.Encoding.UTF8.GetString(passwordEncriptada);

                var usuario = new Usuarios
                {
                    email = registro.Email,
                    password = password,
                    IdPersona = persona.IdPersona,
                    estatus = '1'
                };

                _context.Usuarios.Add(usuario);
                _context.SaveChanges();

                // Crear la entidad Usuario_Rol
                var usuarioRol = new Usuarios_Roles
                {
                    IdUsuario = usuario.IdUsuario,
                    IdRol = 3
                };


                _context.Usuarios_Roles.Add(usuarioRol);

                _context.SaveChanges();


                return Ok(new { status = "success", message = "Usuario registrado exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }

        private bool VerificarPassword(string password)
        {

            bool contieneMayuscula = password.Any(char.IsUpper);
            bool contieneCaracterEspecial = password.Any(c => !char.IsLetterOrDigit(c));
            bool contieneLetras = password.Any(char.IsLetter);
            bool contieneNumeros = password.Any(char.IsDigit);

            return contieneMayuscula && contieneCaracterEspecial && contieneLetras && contieneNumeros;
        }




        [HttpPost("ModificarUsuario")]

        public IActionResult ModificarUsuario(RegistroViewModel registro,  long idUsuario, String email)
        {
            try
            {
                var usuarioOldEmail = _context.Usuarios.Include(u => u.Persona).FirstOrDefault(u => u.email == email);


                if (usuarioOldEmail != null)
                {
                    if (usuarioOldEmail.email != email)
                    {
                        if (_context.Usuarios.Any(u => u.email == registro.Email))
                        {
                            return BadRequest(new { status = "error", message = "El correo ya está registrado." });
                        }
                    }
                }



                var passwordEncriptada = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(registro.Password));

                var password = System.Text.Encoding.UTF8.GetString(passwordEncriptada);





                var usuario = _context.Usuarios.Include(u => u.Persona).FirstOrDefault(u => u.IdUsuario == idUsuario);

                if (usuario != null)
                {
                    // Actualizar datos del usuario
                    usuario.email = registro.Email;
                    usuario.password =  password;

                    // Actualizar datos de la persona relacionada
                    usuario.Persona.nombres = registro.Nombres;
                    usuario.Persona.apellidoPaterno = registro.ApellidoPaterno;
                    usuario.Persona.apellidoMaterno = registro.ApellidoMaterno;
                    usuario.Persona.telefono = registro.Telefono;

                    _context.SaveChanges();

                    return Ok(new { status = "success", message = "Usuario modificado exitosamente." });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "No se encontró el usuario." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }



        [HttpPost("EliminarUsuario")]

        public IActionResult EliminarUsuario(long id)
        {
            try
            {
                var usuario = _context.Usuarios.FirstOrDefault(u => u.IdUsuario ==  id);

                if (usuario != null)
                {
                    usuario.estatus = '0';

                    _context.SaveChanges();

                    return Ok(new { status = "success", message = "Usuario eliminado exitosamente." });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "No se encontró el usuario." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }


        [HttpPost("ActivarUsuario")]

        public IActionResult ActivarUsuario( long id)
        {
            try
            {
                var usuario = _context.Usuarios.FirstOrDefault(u => u.IdUsuario ==  id);

                if (usuario != null)
                {
                    usuario.estatus = '1';

                    _context.SaveChanges();

                    return Ok(new { status = "success", message = "Usuario activado exitosamente." });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "No se encontró el usuario." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }






    }

    public class RegistroViewModel
    {


       // public long Id { get; set; }
        public string Nombres { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }



    
}
