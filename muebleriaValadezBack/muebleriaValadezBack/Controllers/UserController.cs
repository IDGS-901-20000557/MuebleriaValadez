using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
                var results = _context.Usuarios.Include(u => u.Persona).ToList();

                if (results.Count > 0)
                {
                    return new JsonResult(results);
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

        public IActionResult ModificarUsuario(RegistroViewModel registro, String oldPassword, long idUsuario, String email, String newPassword)
        {
            try
            {
                //consultar oldEmail
                var usuarioOldEmail = _context.Usuarios.Include(u => u.Persona).FirstOrDefault(u => u.email == email);

                //si mandan un email diferente al que ya está registrado, verificar que no exista en la base de datos

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

             //   if (_context.Usuarios.Any(u => u.email == registro.Email))
              //  {
              //      return BadRequest(new { status = "error", message = "El correo ya está registrado." });
              //  }

                //verificar si se esta mandadno un password nuevo

                //encriptar la password
                String passwordsave = null;
                if (newPassword != null)
                {

                    var passwordEncriptadaOld = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(oldPassword));

                    var passwordOld = System.Text.Encoding.UTF8.GetString(passwordEncriptadaOld);

                    var usuarioOld = _context.Usuarios.Include(u => u.Persona).FirstOrDefault(u => u.IdUsuario == idUsuario);

                    if (usuarioOld != null)
                    {
                        if (usuarioOld.password != passwordOld)
                        {
                            return BadRequest(new { status = "error", message = "El password anterior no coincide." });
                        }
                        else
                        {

                            var passwordEncriptada = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(newPassword));

                            var password = System.Text.Encoding.UTF8.GetString(passwordEncriptada);

                            passwordsave = password;
                        }
                    }
                    else
                    {
                        return BadRequest(new { status = "error", message = "No se encontró el usuario." });
                    }


                }       




             //   var passwordEncriptada = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(registro.Password));

            //    var password = System.Text.Encoding.UTF8.GetString(passwordEncriptada);

                
               




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
