using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class OrdenesPedidos
    {
        [Key]
        public long IdOrdenPedido { get; set; }
        public int cantidad { get; set; }
        public float subtotal { get; set; }
        public long IdPedido { get; set; }
        public long IdProducto { get; set; }   
    }
}
