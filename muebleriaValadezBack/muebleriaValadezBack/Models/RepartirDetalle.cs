using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    public class RepartirDetalle
    {
        [Key]
        public long IdPedido { get; set; }
        public String nombreCliente { get; set; }
        public String domicilio { get; set; }
        public DateTime? fechaPedido { get; set; }
        public int codigo { get; set; }
        public float? total { get; set; }
        public ProductoRepartir[]? ProductoRepartir { get; set; }
    }

    public class ProductoRepartir
    {
        [Key]
        public long? IdProducto { get; set; }
        public String? nombreProducto { get; set; }
        public int? cantidad { get; set; }
    }
}
