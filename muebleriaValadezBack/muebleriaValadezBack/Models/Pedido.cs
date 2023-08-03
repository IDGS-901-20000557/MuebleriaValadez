using System.ComponentModel.DataAnnotations;
namespace muebleriaValadezBack.Models
{
    public class Pedido
    {
        [Key]
        public long IdPedido { get; set; }
        public DateTime fechaPedido { get; set; }
        public DateTime? fechaEntrega { get; set; }
        public String estatus { get; set; }
        public int codigo { get; set; }
        public float total { get; set; }
        public long IdCliente { get; set; }
        public long? IdEmpleadoEntrega { get; set; }
        public long IdDireccion { get; set; }
        public long IdTarjeta{ get; set; }
    }
}
