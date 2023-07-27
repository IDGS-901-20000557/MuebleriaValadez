using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Inventario
    {
        [Key]
        public long IdInventario { get; set; }
        public long IdSucursal { get; set; }
        public double cantidaDisponible { get; set; }

    }
}
