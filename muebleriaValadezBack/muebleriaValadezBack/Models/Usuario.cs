using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Usuario
    {
        [Key]
        public long IdUsuario { get; set; }
        public String? email { get; set; }
        public String? password { get; set; }
        public Personas? persona  { get; set; }
        public char? estatus { get; set; }

    }
}
