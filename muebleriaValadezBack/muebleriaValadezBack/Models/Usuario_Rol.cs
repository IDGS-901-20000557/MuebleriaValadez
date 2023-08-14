using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    public class Usuario_Rol
    {
        [Key]
        public long IdUsuario_Rol { get; set; }
        public Usuario? Usuario { get; set; }
        public Rol? Rol { get; set; }

        [ForeignKey("Usuario")]
        public long IdUsuario { get; set; }

        [ForeignKey("Rol")]
        public long IdRol { get; set; }
    }
}
