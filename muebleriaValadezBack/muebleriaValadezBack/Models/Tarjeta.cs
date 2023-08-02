using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Tarjetas
    {
        [Key]
        public long IdTarjeta { get; set; }
        public long numeroTarejta { get; set; }
        public String nombreTitular { get; set; }
        public String vencimiento { get; set; }
        public int cvv { get; set; }
        public String tipo { get; set; }
        public long IdCliente { get; set; }
    }
}
