using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{

    //integracion del proyecto
    public class Cliente
    {
        [Key]
        public long IdCliente { get; set; }
        public Personas persona { get; set; }

        [ForeignKey("persona")]
        public long? IdPersona { get; set; }
    }
}
