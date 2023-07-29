using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Cliente
    {
        [Key]
        public long IdCliente { get; set; }
        public Personas persona { get; set; }
    }
}
