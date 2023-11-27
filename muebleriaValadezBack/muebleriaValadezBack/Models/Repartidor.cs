using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Repartidor
    {
        [Key]
        public long IdPedido { get; set; }
        public String nombreCliente { get; set; }
        public String domicilio { get; set; }
        public DateTime? fechaPedido { get; set; }
        public int codigo { get; set; }
        public float? total { get; set; }
    }
}
