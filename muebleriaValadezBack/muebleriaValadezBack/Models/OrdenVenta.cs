using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class OrdenVenta
    {
        [Key]
        [Column("IdOrdenVenta")]
        public long? IdOrdenVenta { get; set; }
        public DateTime? fechaVenta { get; set; }
        public DateTime? fechaEntrega { get; set; }
        public float total { get; set; }
        public long? IdCliente { get; set; }
        public char? estatus { get; set; }
        public long? IdUsuario { get; set; }
        public long? IdDireccion { get; set; }
        public long? IdEmpleadoMostrador { get; set; }
        public char? tipoPago { get; set; }
        public ProductosVenta[]? ProductosVenta { get; set; }

    }

    public class ProductosVenta
    {
        [Key]
        public long? idProducto { get; set; }
        public string? nombreProducto { get; set; }
        public double? precioVenta { get; set; }
        public double? subtotal { get; set; }
        public double? cantidadProducto { get; set; }
    }

    public class ClienteVentas
    {
        [Key]
        public long? idCliente { get; set; }
        public string? nombres { get; set; }
        public string? apellidoPaterno { get; set; }
        public string? apellidoMaterno { get; set; }
        public string? email { get; set; }
        public string? password { get; set; }
        public string? telefono { get; set; }
    }

    public class DomicilioResult
    {
        [Key]
        public long? IdDomicilio { get; set; }
        public string? Colonia { get; set; }
        public string? ciudad { get; set; }
        public string? estado { get; set; }
        public int? cp { get; set; }
        public string? Pais { get; set; }
    }

    public class DireccionesVentas
    {
        [Key]
        public long? idDireccion { get; set; }
        public string? calle { get; set; }
        public int? noExt { get; set; }
        public int? noInt { get; set; }
        public long? idDomicilio { get; set; }
    }
}
