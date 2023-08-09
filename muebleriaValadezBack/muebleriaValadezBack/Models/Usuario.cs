using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    //integracion del proyecto
    public class Usuario
    {
        [Key]
        public long IdUsuario { get; set; }
        public String? email { get; set; }
        public String? password { get; set; }
        public Personas? persona  { get; set; }
        public char? estatus { get; set; }

        [ForeignKey("persona")]
        public long? IdPersona { get; set; }

    }
}
