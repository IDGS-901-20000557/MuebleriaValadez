using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Insumo
    {
        [Key]
        public long IdInsumo { get; set; }
        public string nombreInsumo { get; set; }
        public long IdProveedor { get; set; }
        public long IdInventario { get; set; }
        public string unidad { get; set; }
        public double precio { get; set; }
        public string observaciones { get; set; }
        public double cantidadAceptable { get; set; }
        public char estatus { get; set; }
    }
}
