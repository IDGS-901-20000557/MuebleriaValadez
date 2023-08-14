using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace muebleriaValadezBack.Models
{
    public class Lotes
    {
        [Key]
        [Column("IdLote")]
        public long? IdLote { get; set; }
        public int? noLote { get; set; }
        public string? observaciones { get; set; }
        public DateTime? fechaGenerado { get; set; }
        public DateTime? fechaObtencion { get; set; }
        public long? idSucursal { get; set; }
        public long? idUsuario { get; set; }
        public float? costo { get; set; }
        public char? estatus { get; set; }
        public InsumoLote[]? InsumosLote { get; set; }
        public ProductosLote[]? ProductosLote { get; set; }


    }

    [Keyless]
    public class InventarioResult
    {
        public string nombre { get; set; }
        public double costo { get; set; }
        public double cantidadAceptable { get; set; }
        public double cantidaDisponible { get; set; }
        public string tipo { get; set; }
    }

    public class InsumoLote
    {
        [Key]
        [Column("IdInsumo")]
        public long? IdInsumo { get; set; }
        public String? nombreInsumo { get; set; }
        public double? precio { get; set; }
        public double? cantidadInsumo { get; set; }
        public String? unidad { get; set; }
    }

    public class ProductosLote
    {
        [Key]
        public long? idProducto { get; set; }
        public string? nombreProducto { get; set; }
        public string? descripcion { get; set; }
        public string? foto { get; set; }
        public double? costoProduccion { get; set; }
        public double? precioVenta { get; set; }
        public string? observaciones { get; set; }
        public double? cantidadAceptable { get; set; }
        public double? cantidadProducto { get; set; }
    }
}
