using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Usuario_Rol
    {
        [Key]
        public long IdUsuario_Rol { get; set; }
        public Usuario usuario { get; set; }
        public Rol rol { get; set; }
    }
}
