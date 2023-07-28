using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    public class Usuarios
    {
        [Key]
        public long IdUsuario { get; set; }

        public string email { get; set; }
        public string? password { get; set; }

        [ForeignKey("Persona")]
        public long? IdPersona { get; set; }

        public char? estatus { get; set; }

        public Personas? Persona { get; set; }
    }
}