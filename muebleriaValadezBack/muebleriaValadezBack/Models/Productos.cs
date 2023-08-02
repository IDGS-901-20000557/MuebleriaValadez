using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Productos
    {
        [Key]
        public long idProducto { get; set; }
        public string nombreProducto { get; set; }
        public string descripcion { get; set; }
        public string foto { get; set; }
        public float costoProduccion { get; set; }
        public float precioVenta { get; set; }
        public string observaciones { get; set; }
        public long IdInventario { get; set; }
        public double cantidadAceptable { get; set; }
    }
}
