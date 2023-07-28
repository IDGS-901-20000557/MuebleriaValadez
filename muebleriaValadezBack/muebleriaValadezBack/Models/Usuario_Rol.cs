using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    public class Usuarios_Roles
    {
        [Key]
        public long IdUsuario_Rol { get; set; }

        [ForeignKey("Usuario")]

        public long IdUsuario { get; set; }

       [ForeignKey("Rol")]
        public long IdRol { get; set; }

        public Usuarios Usuario { get; set; }

        public Roles Rol { get; set; }
    }
}