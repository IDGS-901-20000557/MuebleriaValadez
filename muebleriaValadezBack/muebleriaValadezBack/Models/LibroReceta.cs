using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    [Serializable]
    public class LibroReceta
    {
        [Key]
        [Column("idLibroReceta")]
        public long? idLibroReceta { get; set; }
        public InsumoData[]? InsumosLibroRecetas { get; set; }
        public ProductosData? productoLibroRecetas { get; set; }
        public long? idUsuario { get; set; }
        public long? idSucursal { get; set; }
    }

    public class InsumoData
        {
        [Key]
        [Column("IdInsumo")]
        public long? IdInsumo { get; set; }
            public String? nombreInsumo { get; set; }
            public double? precio { get; set; }
        public float? cantidadInsumo { get; set; }
        public String? unidad { get; set; }
    }

        public class ProductosData
        {
        [Key]
        public long? idProducto { get; set; }
        public string? nombreProducto { get; set; }
            public string? descripcion { get; set; }
            public string? foto { get; set; }
            public float? costoProduccion { get; set; }
            public float? precioVenta { get; set; }
            public string? observaciones { get; set; }
            public float? cantidadAceptable { get; set; }
        }
}
