using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Win32;
using muebleriaValadezBack.Models;
using System;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Security.Cryptography;

//integracion del proyecto

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
        [HttpGet("roles")]

        public IActionResult Roles()
        {
            try
            {
                var roles = _context.Roles.Where(r => r.IdRol != 3).ToList();
                if (roles.Count > 0)
                {
                    return new JsonResult(roles);
                }
                else
                {
                    var error = new { status = "error", message = "No hay roles registrados" };
                    return new JsonResult(error);
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }

        [HttpGet("sucursales")]
        public IActionResult Sucursales()
        {
            try
            {
                var sucursales = _context.Sucursales.ToList();
                if (sucursales.Count > 0)
                {
                    return new JsonResult(sucursales);
                }
                else
                {
                    var error = new { status = "error", message = "No hay sucursales registradas" };
                    return new JsonResult(error);
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(ex);
            }
        }


        [HttpGet("user")]
        public IActionResult user(int? id)
        {
            try
            {
                var clientes = _context.Usuarios
                    .Include(u => u.persona)
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
                            u.persona.nombres,
                            u.persona.apellidoPaterno,
                            u.persona.apellidoMaterno,
                            u.persona.telefono,
                            u.estatus,
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
                            r.descripcion,
                            ur.estatus
                        }
                    ).Where(u => u.IdUsuario == id).ToList();





                if (clientes.Count > 0)
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

        [HttpGet("users")]
        public IActionResult Index()
        {
            try
            {
                var clientes = _context.Usuarios
                    .Include(u => u.persona)
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
                            u.persona.nombres,
                            u.persona.apellidoPaterno,
                            u.persona.apellidoMaterno,
                            u.persona.telefono,
                            u.estatus,
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
                            r.descripcion,
                            ur.estatus
                        }
                    )

                    .ToList();




                if (clientes.Count > 0)
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
        public IActionResult empleados(int id)
        {
            try
            {
                //  var clientes = _context.Usuarios.Include(u => u.Persona).ToList();
                // var empleados = _context.Sucursales.ToList();

                var empleados = _context.Usuarios
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
                                empleado.IdSucursal // Agregar el campo de la sucursal desde la tabla Empleados
                            }
                        )
                        .Join(
                            _context.Sucursales,
                            ue => ue.IdSucursal, // Clave foránea desde la tabla Empleados
                            sucursal => sucursal.IdSucursal, // Clave primaria de la tabla Sucursales
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
                                SucursalId = sucursal.IdSucursal,
                                sucursal.razonSocial,
                                sucursal.IdDireccion
                            }
                        ).Join(_context.Usuarios_Roles,
                            ue => ue.IdUsuario,
                            ur => ur.IdUsuario,
                            (ue, ur) => new
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
                                ue.SucursalId,
                                ue.razonSocial,
                                ue.IdDireccion,
                                ur.IdRol
                            }
                        )
                        .Where(ue => ue.IdUsuario == id).ToList();



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
        public IActionResult RegistrarUsuario(RegistroViewModel registro, long idUsuariob)
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

            /*  bool passwordValido = VerificarPassword(registro.Password);
              if (!passwordValido)
              {
                  return BadRequest(new { status = "error", message = "El password no cumple con los requisitos mínimos." });
              }*/



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

                /* var passwordEncriptada = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(registro.Password));

                 var password = System.Text.Encoding.UTF8.GetString(passwordEncriptada);*/

                var usuario = new Usuario
                {
                    email = registro.Email,
                    password = registro.Password,
                    IdPersona = persona.IdPersona,
                    estatus = '1'
                };

                _context.Usuarios.Add(usuario);
                _context.SaveChanges();

                // Crear la entidad Usuario_Rol
                var usuarioRol = new Usuario_Rol
                {
                    IdUsuario = usuario.IdUsuario,
                    IdRol = 3
                };

                _context.Usuarios_Roles.Add(usuarioRol);

                _context.SaveChanges();

                //crear la entidad Cliente

                var cliente = new Cliente
                {
                    IdPersona = persona.IdPersona

                };

                _context.Clientes.Add(cliente);

                _context.SaveChanges();



                var parametros = new[]                {
                    new SqlParameter("@idUsuario", idUsuariob),
                    new SqlParameter("@movimiento", "Inserción"),
                    new SqlParameter("@modulo", "Usuarios"),
                    new SqlParameter("@observaciones", "El usuario: " + idUsuariob +"   inserto un usuario de tipo:3"),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);


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

        [HttpPost("registerEm")]
        public IActionResult RegistrarUsuarioEm(RegistroEmViewModel registro, long idUsuariob)
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

            /*   bool passwordValido = VerificarPassword(registro.Password);
               if (!passwordValido)
               {
                   return BadRequest(new { status = "error", message = "El password no cumple con los requisitos mínimos." });
               }*/



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

                /*  var passwordEncriptada = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(registro.Password));

                  var password = System.Text.Encoding.UTF8.GetString(passwordEncriptada);*/

                var usuario = new Usuario
                {
                    email = registro.Email,
                    password = registro.Password,
                    IdPersona = persona.IdPersona,
                    estatus = '1'
                };

                _context.Usuarios.Add(usuario);
                _context.SaveChanges();

                // Crear la entidad Usuario_Rol
                var usuarioRol = new Usuario_Rol
                {
                    IdUsuario = usuario.IdUsuario,
                    IdRol = registro.Rol
                };

                _context.Usuarios_Roles.Add(usuarioRol);

                _context.SaveChanges();

                // Crear la entidad Empleado
                //aqui esta el error
                var empleado = new Empleado
                {
                    IdSucursal = registro.Sucursal,
                    IdPersona = persona.IdPersona,
                    rfc = registro.Rfc,
                    puesto = registro.Puesto


                };

                _context.Empleados.Add(empleado);
                _context.SaveChanges();



                var parametros = new[]                {
                    new SqlParameter("@idUsuario",idUsuariob),
                    new SqlParameter("@movimiento", "Inserción"),
                    new SqlParameter("@modulo", "Usuarios"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +"   inserto un usuario de tipo: "+registro.Rol),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);




                return Ok(new { status = "success", message = "Usuario registrado exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Error interno del servidor", error = ex.Message });
            }
        }



        [HttpPost("ModificarUsuario")]

        public IActionResult ModificarUsuario(RegistroViewModel registro, int idUsuario, long idUsuariob)
        {
            try
            {

                var usuario = _context.Usuarios.Include(u => u.persona).FirstOrDefault(u => u.IdUsuario == idUsuario);

                //checar si los correos son distintos y si si checar si el nuevo correo ya existe
                if (usuario.email != registro.Email)
                {
                    if (_context.Usuarios.Any(u => u.email == registro.Email))
                    {
                        return BadRequest(new { status = "error", message = "El correo ya está registrado." });
                    }
                }

                //checar si la nueva password es igual a la anterior y si verificar que cumpla y si si escriptar la nueva password

                /* var password = usuario.password;

                 if (usuario.password != registro.Password)
                 {
                     bool passwordValido = VerificarPassword(registro.Password);
                     if (!passwordValido)
                     {
                         return BadRequest(new { status = "error", message = "El password no cumple con los requisitos mínimos." });
                     }

                     var passwordEncriptada = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(registro.Password));

                     password = System.Text.Encoding.UTF8.GetString(passwordEncriptada);
                 }*/




                if (usuario != null)
                {
                    // Actualizar datos del usuario
                    usuario.email = registro.Email;
                    usuario.password = registro.Password;

                    // Actualizar datos de la persona relacionada
                    usuario.persona.nombres = registro.Nombres;
                    usuario.persona.apellidoPaterno = registro.ApellidoPaterno;
                    usuario.persona.apellidoMaterno = registro.ApellidoMaterno;
                    usuario.persona.telefono = registro.Telefono;

                    _context.SaveChanges();


                    var parametros = new[]                {
                    new SqlParameter("@idUsuario", idUsuariob),
                    new SqlParameter("@movimiento", "Modificación"),
                    new SqlParameter("@modulo", "Usuarios"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +"   modifico al usuario: "+idUsuario),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);


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


        [HttpPost("ModificarEmpelado")]

        public IActionResult ModificarEmpelado(RegistroEmViewModel registro, int idUsuario, long idUsuariob)
        {
            try
            {

                var empleado = _context.Usuarios.Include(u => u.persona).FirstOrDefault(u => u.IdUsuario == idUsuario);
                //checar si los correos son distintos y si si checar si el nuevo correo ya existe
                if (empleado.email != registro.Email)
                {
                    if (_context.Usuarios.Any(u => u.email == registro.Email))
                    {
                        return BadRequest(new { status = "error", message = "El correo ya está registrado." });
                    }
                }

                //checar si la nueva password es igual a la anterior y si verificar que cumpla y si si escriptar la nueva password

                /* var password = empleado.password;

                 if (empleado.password != registro.Password)
                 {
                     bool passwordValido = VerificarPassword(registro.Password);
                     if (!passwordValido)
                     {
                         return BadRequest(new { status = "error", message = "El password no cumple con los requisitos mínimos." });
                     }


                     var passwordEncriptada = SHA512.Create().ComputeHash(System.Text.Encoding.UTF8.GetBytes(registro.Password));

                     password = System.Text.Encoding.UTF8.GetString(passwordEncriptada);
                 }*/



                //vamos a buscar al empleado con el id que empleado.persona.idpersona == idpersona

                var em = _context.Empleados.FirstOrDefault(e => e.IdPersona == empleado.persona.IdPersona);

                //si esta vacio terminamos el proceso

                if (em == null)
                {
                    return BadRequest(new { status = "error", message = "No se encontró el empleado." });
                }

                //obtenermos a usuario rol con el idusuario
                var usuarioRol = _context.Usuarios_Roles.FirstOrDefault(ur => ur.IdUsuario == idUsuario);

                //si esta vacio terminamos el proceso

                if (usuarioRol == null)
                {
                    return BadRequest(new { status = "error", message = "No se encontró el usuario rol." });
                }




                if (empleado != null)
                {

                    //como no tenemos la relacion bien vamos a tener que hacer una actualizacion por cada tabla


                    empleado.email = registro.Email;
                    empleado.password = registro.Password;

                    // Actualizar datos de la persona relacionada
                    empleado.persona.nombres = registro.Nombres;
                    empleado.persona.apellidoPaterno = registro.ApellidoPaterno;
                    empleado.persona.apellidoMaterno = registro.ApellidoMaterno;
                    empleado.persona.telefono = registro.Telefono;

                    // Actualizar datos del empleado relacionado

                    em.rfc = registro.Rfc;
                    em.puesto = registro.Puesto;
                    em.IdSucursal = registro.Sucursal;

                    // Actualizar datos del usuario rol relacionado

                    usuarioRol.IdRol = registro.Rol;

                    _context.SaveChanges();


                    var parametros = new[]                {
                    new SqlParameter("@idUsuario",  idUsuariob ),
                    new SqlParameter("@movimiento", "Modificación"),
                    new SqlParameter("@modulo", "Usuarios"),
                    new SqlParameter("@observaciones", "El usuario: " + idUsuariob +"   modifico al empleado: "+idUsuario),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);




                    return Ok(new { status = "success", message = "Empleado actualizado exitosamente." });



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

        public IActionResult EliminarUsuario(long id, long idUsuariob)
        {
            try
            {
                var usuario = _context.Usuarios.FirstOrDefault(u => u.IdUsuario == id);

                if (usuario != null)
                {
                    usuario.estatus = '0';

                    _context.SaveChanges();



                    var parametros = new[] {
                    new SqlParameter("@idUsuario",  idUsuariob ),
                    new SqlParameter("@movimiento", "Modificación"),
                    new SqlParameter("@modulo", "Usuarios"),
                    new SqlParameter("@observaciones", "El usuario: " + idUsuariob +"   desactivo al usuario: "+id),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);

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

        public IActionResult ActivarUsuario(long id, long idUsuariob)
        {
            try
            {
                var usuario = _context.Usuarios.FirstOrDefault(u => u.IdUsuario == id);

                if (usuario != null)
                {
                    usuario.estatus = '1';

                    _context.SaveChanges();

                    var parametros = new[] {

                    new SqlParameter("@idUsuario", idUsuariob ),
                    new SqlParameter("@movimiento", "Modificación"),
                    new SqlParameter("@modulo", "Usuarios"),
                    new SqlParameter("@observaciones", " El usuario: " + idUsuariob +"   activo al usuario: "+id),
                    new SqlParameter("@fecha", DateTime.Now)
                };



                    _context.Database.ExecuteSqlRaw("EXEC sp_InsertarBitacora @idUsuario, @movimiento, @modulo, @observaciones, @fecha", parametros);

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

    public class RegistroEmViewModel
    {


        // public long Id { get; set; }
        public string Nombres { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public string Rfc { get; set; }

        public long Sucursal { get; set; }

        public string Puesto { get; set; }

        public long Rol { get; set; }



    }




}







